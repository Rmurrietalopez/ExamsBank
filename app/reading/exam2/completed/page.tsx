'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useReadingExam } from '@/context/ReadingExamContext';
import { correctAnswersExam2 } from '@/lib/constants/correctAnswersExam2';

type ExerciseKey = 'ex1' | 'ex2' | 'ex3' | 'ex4';

type SectionScore = {
  score: number;
  total: number;
};

function scoreExercise(
  exerciseKey: ExerciseKey,
  answers: Record<string, Record<string, string>>
): SectionScore {
  const correctMap = correctAnswersExam2[exerciseKey] || {};
  const studentMap = answers[exerciseKey] || {};

  let score = 0;
  const questionIds = Object.keys(correctMap);
  const total = questionIds.length;

  questionIds.forEach((qid) => {
    const correct = correctMap[qid];
    const student = studentMap[qid];
    if (student && student === correct) score += 1;
  });

  return { score, total };
}

export default function ReadingExam2CompletedPage() {
  const router = useRouter();
  const { student, answers } = useReadingExam();
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const savedOnce = useRef(false);

  // If someone hits this page without starting the exam, kick them back
  useEffect(() => {
    if (!student) {
      router.replace('/reading/exam2');
    }
  }, [student, router]);

  const s1 = useMemo(() => scoreExercise('ex1', answers), [answers]);
  const s2 = useMemo(() => scoreExercise('ex2', answers), [answers]);
  const s3 = useMemo(() => scoreExercise('ex3', answers), [answers]);
  const s4 = useMemo(() => scoreExercise('ex4', answers), [answers]);

  const totalScore = s1.score + s2.score + s3.score + s4.score;
  const totalItems = s1.total + s2.total + s3.total + s4.total;

  // Save results to Firestore exactly once
  useEffect(() => {
    if (!student) return;
    if (savedOnce.current) return;

    const save = async () => {
      try {
        savedOnce.current = true;
        setSaving(true);

        const docRef = await addDoc(collection(db, 'readingExamResults'), {
          studentName: student.studentName,
          studentEmail: student.email,
          teacherName: student.teacherName,
          submittedAt: serverTimestamp(),
          examId: student.examId,          // "reading-exam-2"
          examLabel: 'Reading Exam 2',     // label for reading-only dashboard
          answers,                         // raw answers object
          scores: {
            ex1: s1,
            ex2: s2,
            ex3: s3,
            ex4: s4,
            total: { score: totalScore, total: totalItems },
          },
          version: 'reading-exam-2-v1',
        });

        setSavedId(docRef.id);
      } catch (err) {
        console.error('Error saving reading exam 2:', err);
      } finally {
        setSaving(false);
      }
    };

    save();
  }, [student, answers, s1, s2, s3, s4, totalScore, totalItems]);

  if (!student) return null;

  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-[#fffcf9] border border-[#c4baad] rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-[#1f2933] flex items-center gap-2">
          Exam Completed <span className="text-green-600 text-xl">✅</span>
        </h1>

        <p className="text-sm text-gray-900">
          Thank you, <strong>{student.studentName || 'Student'}</strong>. Your{' '}
          <strong>Reading Exam 2</strong> has been submitted.
        </p>

        <section className="space-y-1 text-sm text-gray-900">
          <h2 className="text-lg font-semibold">Your Results</h2>
          <p>
            Part 1 – Reading Correspondence:{' '}
            <strong>
              {s1.score}/{s1.total}
            </strong>
          </p>
          <p>
            Part 2 – Reading to Apply a Diagram:{' '}
            <strong>
              {s2.score}/{s2.total}
            </strong>
          </p>
          <p>
            Part 3 – Reading for Information:{' '}
            <strong>
              {s3.score}/{s3.total}
            </strong>
          </p>
          <p>
            Part 4 – Reading for Viewpoints:{' '}
            <strong>
              {s4.score}/{s4.total}
            </strong>
          </p>

          <p className="mt-2">
            Total:{' '}
            <strong>
              {totalScore}/{totalItems}
            </strong>
          </p>

          <p className="text-xs opacity-80 mt-2">
            A teacher will review your answers and contact you with any feedback.
          </p>
        </section>

        <div className="flex flex-wrap gap-3 pt-2 text-sm">
          <button
            disabled={saving}
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-[#d40000] text-white rounded-md font-semibold hover:bg-[#ba0000] transition-colors disabled:opacity-70"
          >
            {saving ? 'Saving…' : 'Return to Home'}
          </button>
        </div>

        {savedId && (
          <p className="text-[10px] opacity-60 mt-3">
            Submission ID: {savedId}
          </p>
        )}
      </div>
    </main>
  );
}

