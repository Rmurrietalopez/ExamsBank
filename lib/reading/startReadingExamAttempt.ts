// lib/reading/startReadingExamAttempt.ts
import { db } from '@/lib/firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

type StartAttemptParams = {
  examId: string;
  studentName: string;
  email: string;
  teacherName: string;
};

export async function startReadingExamAttempt({
  examId,
  studentName,
  email,
  teacherName,
}: StartAttemptParams): Promise<string> {
  const docRef = await addDoc(collection(db, 'readingExamAttempts'), {
    examId,
    studentName,
    email,
    teacherName,
    createdAt: serverTimestamp(),
  });

  return docRef.id; // attemptId
}
