'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { startSpeakingExamAttempt } from '@/lib/speaking/startSpeakingExamAttempt';

type StudentInfo = {
  examId: string;
  studentName: string;
  email: string;
  teacherName: string;
  attemptId: string;
};

type SpeakingTaskLocal = {
  // either recorded blob or uploaded file
  blob?: Blob;
  file?: File;

  // preview URL (created with URL.createObjectURL)
  previewUrl?: string;

  // after upload
  audioUrl?: string;
  mimeType?: string;
  seconds?: number;
};

type SpeakingTasksState = {
  [taskId: string]: SpeakingTaskLocal;
};

type SpeakingExamContextValue = {
  student: StudentInfo | null;
  tasks: SpeakingTasksState;

  startExam: (params: {
    examId: string;
    studentName: string;
    email: string;
    teacherName: string;
  }) => Promise<void>;

  setTaskAudio: (
    taskId: string,
    payload: {
      blob?: Blob;
      file?: File;
      previewUrl?: string;
      mimeType?: string;
      seconds?: number;
    }
  ) => void;

  setTaskUploaded: (
    taskId: string,
    payload: { audioUrl: string; mimeType?: string; seconds?: number }
  ) => void;

  resetExam: () => void;
};

const SpeakingExamContext = createContext<SpeakingExamContextValue | undefined>(
  undefined
);

export function SpeakingExamProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [tasks, setTasks] = useState<SpeakingTasksState>({});

  const startExam = async ({
    examId,
    studentName,
    email,
    teacherName,
  }: {
    examId: string;
    studentName: string;
    email: string;
    teacherName: string;
  }) => {
    const attemptId = await startSpeakingExamAttempt({
      examId,
      studentName,
      email,
      teacherName,
    });

    setStudent({
      examId,
      studentName,
      email,
      teacherName,
      attemptId,
    });
  };

  const setTaskAudio: SpeakingExamContextValue['setTaskAudio'] = (
    taskId,
    payload
  ) => {
    setTasks((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        ...payload,
      },
    }));
  };

  const setTaskUploaded: SpeakingExamContextValue['setTaskUploaded'] = (
    taskId,
    payload
  ) => {
    setTasks((prev) => ({
      ...prev,
      [taskId]: {
        ...(prev[taskId] || {}),
        ...payload,
      },
    }));
  };

  const resetExam = () => {
    // cleanup preview URLs to avoid memory leaks
    Object.values(tasks).forEach((t) => {
      if (t.previewUrl) URL.revokeObjectURL(t.previewUrl);
    });

    setStudent(null);
    setTasks({});
  };

  return (
    <SpeakingExamContext.Provider
      value={{
        student,
        tasks,
        startExam,
        setTaskAudio,
        setTaskUploaded,
        resetExam,
      }}
    >
      {children}
    </SpeakingExamContext.Provider>
  );
}

export const useSpeakingExam = () => {
  const ctx = useContext(SpeakingExamContext);
  if (!ctx) {
    throw new Error('useSpeakingExam must be used within SpeakingExamProvider');
  }
  return ctx;
};
