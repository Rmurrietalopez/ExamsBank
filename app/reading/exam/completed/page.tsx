'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { correctAnswers } from '@/lib/constants/correctAnswers';
import { useReadingExam } from '@/context/ReadingExamContext';

type SectionKey = 'readingTest1' | 'readingTest2' | 'readingTest3' | 'readingTest4';
type RawSection =
  | number[]
  | string[]
  | Record<string, string | number>
  | undefined
  | null;

const LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;
const letterToIndex: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4 };

function normalizeToIndexArray(raw: RawSection): number[] {
  if (!raw) return [];

  if (Array.isArray(raw) && raw.every((v) => typeof v === 'number')) {
    return (raw as number[]).slice();
  }

  if (Array.isArray(raw) && raw.every((v) => typeof v === 'string')) {
    return (raw as string[]).map((ch) => {
      const idx = letterToIndex[(ch as string).toUpperCase()];
      return typeof idx === 'number' ? idx : -1;
    });
  }

  if (typeof raw === 'object' && !Array.isArray(raw)) {
    const entries = Object.entries(raw as Record<string, string | number>);
    entries.sort((a, b) => {
      const na = parseInt(a[0].replace(/\D+/g, ''), 10);
      const nb = parseInt(b[0].replace(/\D+/g, ''), 10);
      const aNum = isNaN(na) ? Number.MAX_SAFE_INTEGER : na;
      const bNum = isNaN(nb) ? Number.MAX_SAFE_INTEGER : nb;
      return aNum - bNum;
    });

    return entries.map(([, val]) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const up = val.toUpperCase();
        if (up in letterToIndex) return letterToIndex[up];
        const maybeNum = Number(up);
        return Number.isFinite(maybeNum) ? maybeNum : -1;
      }
      return -1;
    });
  }

  return [];
}

function scoreSection(student: number[] | undefined, key: SectionKey) {
  const correct = correctAnswers[key] ?? [];
  const s = student ?? [];
  let score = 0;
  for (let i = 0; i < correct.length; i++) {
    if (s[i] === correct[i]) score++;
  }
  return { score, total: correct.length };
}

export default function CompletedPage() {
  const router = useRouter();
  const { student, answers, resetExam } = useReadingExam();

  // normalize from context
  const arr1 = useMemo(
    () =>
      normalizeToIndexArray(
        (answers as any)?.readingTest1 ?? (answers as any)?.ex1
      ),
    [answers]
  );
  const arr2 = useMemo(
    () =>
      normalizeToIndexArray(
        (answers as any)?.readingTest2 ?? (answers as any)?.ex2
      ),
    [answers]
  );
  const arr3 = useMemo(
    () =>
      normalizeToIndexArray(
        (answers as any)?.readingTest3 ?? (answers as any)?.ex3
      ),
    [answers]
  );
  const arr4 = useMemo(
    () =>
      normalizeToIndexArray(
        (answers as any)?.readingTest4 ?? (answers as any)?.ex4
      ),
    [answers]
  );

  const r1 = useMemo(() => scoreSection(arr1, 'readingTest1'), [arr1]);
  const r2 = useMemo(() => scoreSection(arr2, 'readingTest2'), [arr2]);
  const r3 = useMemo(() => scoreSection(arr3, 'readingTest3'), [arr3]);
  const r4 = useMemo(() => scoreSection(arr4, 'readingTest4'), [arr4]);

  const totalScore = r1.score + r2.score + r3.score + r4.score;
  const totalItems = r1.total + r2.total + r3.total + r4.total;

  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const hasSavedRef = useRef(false);

  // 👇 derive examId / examName from student info
  const examId = student?.examId || 'readingExam1';
  const examName =
    examId === 'readingExam2'
      ? 'Reading Exam 2'
      : examId === 'readingExam1'
      ? 'Reading Exam 1'
      : examId;

  useEffect(() => {
    if (!student) return;
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    const saveOnce = async () => {
      try {
        setSaving(true);
        const docRef = await addDoc(collection(db, 'readingExamResults'), {
          examId,
          examName,
          studentName: student?.studentName ?? '',
          studentEmail: student?.email ?? '',
          teacherName: student?.teacherName ?? '',
          attemptId: student?.attemptId ?? '',
          submittedAt: serverTimestamp(),

          rawAnswers: {
            ex1: (answers as any)?.ex1 ?? (answers as any)?.readingTest1 ?? null,
            ex2: (answers as any)?.ex2 ?? (answers as any)?.readingTest2 ?? null,
            ex3: (answers as any)?.ex3 ?? (answers as any)?.readingTest3 ?? null,
            ex4: (answers as any)?.ex4 ?? (answers as any)?.readingTest4 ?? null,
          },

          answers: {
            readingTest1: arr1,
            readingTest2: arr2,
            readingTest3: arr3,
            readingTest4: arr4,
          },

          scores: {
            readingTest1: { score: r1.score, total: r1.total },
            readingTest2: { score: r2.score, total: r2.total },
            readingTest3: { score: r3.score, total: r3.total },
            readingTest4: { score: r4.score, total: r4.total },
            total: { score: totalScore, total: totalItems },
          },

          version: 'reading-only-v1',
        });
        setSavedId(docRef.id);
      } catch (err) {
        console.error('Error saving results:', err);
      } finally {
        setSaving(false);
      }
    };

    saveOnce();
  }, [
    student,
    answers,
    arr1,
    arr2,
    arr3,
    arr4,
    r1,
    r2,
    r3,
    r4,
    totalScore,
    totalItems,
    examId,
    examName,
  ]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-base-100 border border-base-300 shadow-xl rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          Exam Completed <span>✅</span>
        </h1>

        <p className="mt-2 text-gray-800 text-sm md:text-base">
          Thank you,{' '}
          <strong className="text-primary">
            {student?.studentName || 'Student'}
          </strong>
          . Your reading exam has been submitted.
        </p>
        <p className="mt-1 text-xs text-gray-700">
          <strong>Exam:</strong> {examName}
        </p>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Your Results
          </h2>
          <ul className="space-y-1 text-sm md:text-base">
            <li>
              Reading Test 1:{' '}
              <strong className="text-primary">
                {r1.score}/{r1.total}
              </strong>
            </li>
            <li>
              Reading Test 2:{' '}
              <strong className="text-primary">
                {r2.score}/{r2.total}
              </strong>
            </li>
            <li>
              Reading Test 3:{' '}
              <strong className="text-primary">
                {r3.score}/{r3.total}
              </strong>
            </li>
            <li>
              Reading Test 4:{' '}
              <strong className="text-primary">
                {r4.score}/{r4.total}
              </strong>
            </li>
          </ul>

          <p className="mt-3 text-base">
            Total:{' '}
            <strong className="text-primary text-lg">
              {totalScore}/{totalItems}
            </strong>
          </p>

          <p className="mt-2 text-xs md:text-sm text-gray-600">
            A teacher will review your answers and contact you with any
            feedback.
          </p>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            disabled={saving}
            onClick={() => router.push('/')}
            className="btn btn-primary flex-1 sm:flex-none"
          >
            {saving ? 'Saving…' : 'Return to Home'}
          </button>

          <button
            onClick={() => {
              resetExam?.();
              router.push('/');
            }}
            className="btn flex-1 sm:flex-none"
          >
            Start Over
          </button>
        </div>

        {savedId && (
          <p className="text-xs opacity-60 mt-4 text-center">
            Submission ID: {savedId}
          </p>
        )}
      </div>
    </div>
  );
}







