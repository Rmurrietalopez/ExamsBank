'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { startReadingExamAttempt } from '@/lib/reading/startReadingExamAttempt';

type StudentInfo = {
  examId: string;
  studentName: string;
  email: string;
  teacherName: string;
  attemptId: string;
};

type ReadingAnswers = {
  // exerciseId -> questionId -> selectedOptionId (letter A/B/C/D/E)
  [exerciseId: string]: {
    [questionId: string]: string;
  };
};

type ReadingExamContextValue = {
  student: StudentInfo | null;
  answers: ReadingAnswers;
  startExam: (params: {
    examId: string;
    studentName: string;
    email: string;
    teacherName: string;
  }) => Promise<void>;
  setAnswer: (exerciseId: string, questionId: string, optionId: string) => void;
  resetExam: () => void; // 👈 added
};

const ReadingExamContext = createContext<ReadingExamContextValue | undefined>(undefined);

export function ReadingExamProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<StudentInfo | null>(null);
  const [answers, setAnswers] = useState<ReadingAnswers>({});

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
    const attemptId = await startReadingExamAttempt({
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

  const setAnswer = (exerciseId: string, questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {}),
        [questionId]: optionId,
      },
    }));
  };

  const resetExam = () => {
    setStudent(null);
    setAnswers({});
  };

  return (
    <ReadingExamContext.Provider value={{ student, answers, startExam, setAnswer, resetExam }}>
      {children}
    </ReadingExamContext.Provider>
  );
}

export const useReadingExam = () => {
  const ctx = useContext(ReadingExamContext);
  if (!ctx) throw new Error('useReadingExam must be used within ReadingExamProvider');
  return ctx;
};

