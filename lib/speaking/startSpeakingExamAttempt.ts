// lib/speaking/startSpeakingExamAttempt.ts
import { db } from '@/lib/firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

type StartAttemptParams = {
  examId: string;
  studentName: string;
  email: string;
  teacherName: string;
};

export async function startSpeakingExamAttempt({
  examId,
  studentName,
  email,
  teacherName,
}: StartAttemptParams): Promise<string> {
  const docRef = await addDoc(collection(db, 'speakingExamAttempts'), {
    examId,
    studentName,
    studentEmail: email, // keep naming consistent with dashboards
    teacherName,
    createdAt: serverTimestamp(),
    // submittedAt: added later on submit
  });

  return docRef.id; // attemptId
}
