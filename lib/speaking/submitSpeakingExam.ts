import { db } from '@/lib/firebaseConfig';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export type SpeakingSubmissionTask = {
  taskId: string;
  title: string;
  prompt: string;
  prepSeconds: number;
  responseSeconds: number;
  audioUrl: string;
  mimeType?: string;
  seconds?: number;
};

export async function submitSpeakingExamAttempt(args: {
  attemptId: string;
  examId: string;
  examName?: string;
  studentName: string;
  studentEmail: string;
  teacherName: string;
  tasks: SpeakingSubmissionTask[];
}) {
  const ref = doc(db, 'speakingExamAttempts', args.attemptId);

  await setDoc(
    ref,
    {
      examId: args.examId,
      examName: args.examName ?? 'Speaking Exam 1',
      studentName: args.studentName,
      studentEmail: args.studentEmail,
      teacherName: args.teacherName,

      submittedAt: serverTimestamp(),

      tasks: args.tasks,
    },
    { merge: true }
  );
}
