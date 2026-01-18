'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { db } from '@/lib/firebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { useReadingExam } from '@/context/ReadingExamContext';
import { correctAnswers } from '@/lib/constants/correctAnswersExam4';

type ScoreBlock = { score: number; total: number };

const mapAD = (v: string | undefined): number | null => {
  if (!v) return null;
  const up = v.toUpperCase();
  if (up === 'A') return 0;
  if (up === 'B') return 1;
  if (up === 'C') return 2;
  if (up === 'D') return 3;
  return null;
};

const mapAE = (v: string | undefined): number | null => {
  if (!v) return null;
  const up = v.toUpperCase();
  if (up === 'A') return 0;
  if (up === 'B') return 1;
  if (up === 'C') return 2;
  if (up === 'D') return 3;
  if (up === 'E') return 4;
  return null;
};

const mapabcd = (v: string | undefined): number | null => {
  if (!v) return null;
  const low = v.toLowerCase();
  if (low === 'a') return 0;
  if (low === 'b') return 1;
  if (low === 'c') return 2;
  if (low === 'd') return 3;
  return null;
};

function calcScoreFromArray(studentArr: number[], correctArr: number[]): ScoreBlock {
  const total = correctArr.length;
  let score = 0;
  for (let i = 0; i < total; i++) {
    if (studentArr[i] === correctArr[i]) score++;
  }
  return { score, total };
}

function toLetterAD(idx: number | null | undefined) {
  if (idx === 0) return 'A';
  if (idx === 1) return 'B';
  if (idx === 2) return 'C';
  if (idx === 3) return 'D';
  return '—';
}

function toLetterAE(idx: number | null | undefined) {
  if (idx === 0) return 'A';
  if (idx === 1) return 'B';
  if (idx === 2) return 'C';
  if (idx === 3) return 'D';
  if (idx === 4) return 'E';
  return '—';
}

export default function ReadingExam4CompletedPage() {
  const router = useRouter();
  const { student, answers, resetExam } = useReadingExam();

  const [submitting, setSubmitting] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ StrictMode guard (dev runs effects twice)
  const hasSubmittedRef = useRef(false);

  const examKey = correctAnswers.readingExam4;

  // Orders MUST match correctAnswersExam4.ts arrays
  const ex1Order = useMemo(
    () => ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'BLANK7', 'BLANK8', 'BLANK9', 'BLANK10', 'BLANK11'],
    []
  );
  const ex2Order = useMemo(
    () => ['BLANK1', 'BLANK2', 'BLANK3', 'BLANK4', 'BLANK5', 'Q6', 'Q7', 'Q8'],
    []
  );
  const ex3Order = useMemo(() => ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9'], []);
  const ex4Order = useMemo(
    () => ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'BLANK6', 'BLANK7', 'BLANK8', 'BLANK9', 'BLANK10'],
    []
  );

  // ✅ Build dashboard-friendly numeric arrays (readingTest1..4)
  const normalized = useMemo(() => {
    const ex1Obj = (answers?.ex1 || {}) as Record<string, string>;
    const ex2Obj = (answers?.ex2 || {}) as Record<string, string>;
    const ex3Obj = (answers?.ex3 || {}) as Record<string, string>;
    const ex4Obj = (answers?.ex4 || {}) as Record<string, string>;

    const readingTest1 = ex1Order.map((id) => {
      const raw = ex1Obj[id];
      return id.startsWith('BLANK') ? mapabcd(raw) : mapAD(raw);
    }).map((x) => (x ?? -1)); // -1 means unanswered (shouldn't happen)

    const readingTest2 = ex2Order.map((id) => {
      const raw = ex2Obj[id];
      return id.startsWith('BLANK') ? mapabcd(raw) : mapAD(raw);
    }).map((x) => (x ?? -1));

    const readingTest3 = ex3Order.map((id) => mapAE(ex3Obj[id])).map((x) => (x ?? -1));

    const readingTest4 = ex4Order.map((id) => {
      const raw = ex4Obj[id];
      return id.startsWith('BLANK') ? mapabcd(raw) : mapAD(raw);
    }).map((x) => (x ?? -1));

    return { readingTest1, readingTest2, readingTest3, readingTest4 };
  }, [answers, ex1Order, ex2Order, ex3Order, ex4Order]);

  // ✅ Scores computed from normalized arrays (most reliable)
  const scores = useMemo(() => {
    const readingTest1 = calcScoreFromArray(normalized.readingTest1, examKey.readingTest1);
    const readingTest2 = calcScoreFromArray(normalized.readingTest2, examKey.readingTest2);
    const readingTest3 = calcScoreFromArray(normalized.readingTest3, examKey.readingTest3);
    const readingTest4 = calcScoreFromArray(normalized.readingTest4, examKey.readingTest4);

    return {
      readingTest1,
      readingTest2,
      readingTest3,
      readingTest4,
      total: {
        score: readingTest1.score + readingTest2.score + readingTest3.score + readingTest4.score,
        total: readingTest1.total + readingTest2.total + readingTest3.total + readingTest4.total,
      },
    };
  }, [normalized, examKey]);

  useEffect(() => {
    const submit = async () => {
      if (hasSubmittedRef.current) return;
      hasSubmittedRef.current = true;

      try {
        setSubmitting(true);
        setError(null);

        if (!student) {
          setSubmitting(false);
          setError('Student info is missing. Please restart the exam from the welcome page.');
          return;
        }

        const submittedAtISO = new Date().toISOString();

        const payload = {
          studentName: student.studentName,
          studentEmail: student.email,
          teacherName: student.teacherName,
          examId: student.examId, // should be reading-exam-4
          attemptId: student.attemptId,

          // ✅ store both timestamp + ISO string (dashboards often prefer string)
          submittedAt: serverTimestamp(),
          submittedAtISO,

          // ✅ dashboard-friendly answers (arrays)
          answers: {
            readingTest1: normalized.readingTest1,
            readingTest2: normalized.readingTest2,
            readingTest3: normalized.readingTest3,
            readingTest4: normalized.readingTest4,
          },

          // ✅ also keep raw answers (optional, useful for debugging)
          answersRaw: {
            ex1: answers?.ex1 || {},
            ex2: answers?.ex2 || {},
            ex3: answers?.ex3 || {},
            ex4: answers?.ex4 || {},
          },

          scores,
        };

        await updateDoc(doc(db, 'readingExamAttempts', student.attemptId), payload);

        setSubmitted(true);
      } catch (e: any) {
        console.error('Error submitting Reading Exam 4:', e);
        setError(e?.message || 'There was a problem submitting the exam.');
      } finally {
        setSubmitting(false);
      }
    };

    submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBackToBank = () => {
    resetExam();
    router.push('/reading');
  };

  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-10 space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
            Reading Exam 4
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            {submitting ? 'Submitting your exam…' : submitted ? 'Exam submitted!' : 'Submission'}
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            Your teacher will review your answers and contact you with feedback.
          </p>
        </header>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        {!!student && (
          <div className="border border-[#c4baad] rounded-2xl px-4 py-4 space-y-1">
            <p className="text-sm">
              <strong>Student:</strong> {student.studentName}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {student.email}
            </p>
            <p className="text-sm">
              <strong>Teacher:</strong> {student.teacherName}
            </p>
            <p className="text-sm">
              <strong>Total score:</strong> {scores.total.score} / {scores.total.total}
            </p>
          </div>
        )}

        {/* ✅ Show answers on completed page */}
        <section className="border border-[#c4baad] rounded-2xl px-4 py-4 space-y-3">
          <h2 className="text-base font-bold text-[#1f2933]">Your Answers</h2>

          <div className="space-y-2 text-sm">
            <p className="font-semibold">Part 1 (A–D)</p>
            <p className="text-gray-800">
              {normalized.readingTest1.map((x, i) => `${i + 1}:${toLetterAD(x)}`).join('  ·  ')}
            </p>

            <p className="font-semibold pt-2">Part 2 (A–D)</p>
            <p className="text-gray-800">
              {normalized.readingTest2.map((x, i) => `${i + 1}:${toLetterAD(x)}`).join('  ·  ')}
            </p>

            <p className="font-semibold pt-2">Part 3 (A–E)</p>
            <p className="text-gray-800">
              {normalized.readingTest3.map((x, i) => `${i + 1}:${toLetterAE(x)}`).join('  ·  ')}
            </p>

            <p className="font-semibold pt-2">Part 4 (A–D)</p>
            <p className="text-gray-800">
              {normalized.readingTest4.map((x, i) => `${i + 1}:${toLetterAD(x)}`).join('  ·  ')}
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3 justify-end pt-2">
          <button
            onClick={handleBackToBank}
            disabled={submitting}
            className="px-5 py-2.5 rounded-md bg-[#d40000] text-white text-sm font-semibold hover:bg-[#ba0000] transition-colors disabled:opacity-70"
          >
            Back to Reading Exams Bank
          </button>

          <Link
            href="/reading/exam4/ex1"
            className="px-5 py-2.5 rounded-md border border-[#c4baad] text-sm font-semibold text-[#1f2933] bg-[#fffcf9] hover:bg-[#f2eddb] transition-colors"
          >
            Review Exam
          </Link>
        </div>
      </div>
    </main>
  );
}






