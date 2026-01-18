'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

type ReadingDashboardRow = {
  id: string;
  source: 'attempts' | 'results'; // ✅ where it came from
  studentName: string;
  studentEmail: string;
  teacherName?: string;
  examId?: string;
  examName?: string;
  submittedAt?: Date;
  totalScore?: number;
  totalItems?: number;
};

function toDateMaybe(v: any): Date | undefined {
  if (!v) return undefined;
  if (v instanceof Date) return v;
  // Firestore Timestamp
  if (typeof v?.toDate === 'function') return v.toDate();
  return undefined;
}

export default function ReadingDashboardPage() {
  const [rows, setRows] = useState<ReadingDashboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // ✅ 1) NEW: attempts (exam4, etc.)
        const qAttempts = query(
          collection(db, 'readingExamAttempts'),
          orderBy('submittedAt', 'desc'),
          limit(50)
        );

        // ✅ 2) OLD: results (your previous dashboard data)
        const qResults = query(
          collection(db, 'readingExamResults'),
          orderBy('submittedAt', 'desc'),
          limit(50)
        );

        const [attemptsSnap, resultsSnap] = await Promise.all([
          getDocs(qAttempts),
          getDocs(qResults),
        ]);

        const attemptsRows: ReadingDashboardRow[] = attemptsSnap.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          const totalScore = data?.scores?.total?.score ?? undefined;
          const totalItems = data?.scores?.total?.total ?? undefined;

          return {
            id: docSnap.id,
            source: 'attempts',
            studentName: data.studentName ?? 'Unknown',
            studentEmail: data.studentEmail ?? '',
            teacherName: data.teacherName ?? '',
            examId: data.examId ?? undefined,
            examName: data.examName ?? undefined,
            submittedAt: toDateMaybe(data.submittedAt as Timestamp | undefined),
            totalScore,
            totalItems,
          };
        });

        const resultsRows: ReadingDashboardRow[] = resultsSnap.docs.map((docSnap) => {
          const data = docSnap.data() as any;
          const totalScore = data?.scores?.total?.score ?? undefined;
          const totalItems = data?.scores?.total?.total ?? undefined;

          return {
            id: docSnap.id,
            source: 'results',
            studentName: data.studentName ?? 'Unknown',
            studentEmail: data.studentEmail ?? '',
            teacherName: data.teacherName ?? '',
            examId: data.examId ?? undefined,
            examName: data.examName ?? undefined,
            submittedAt: toDateMaybe(data.submittedAt as Timestamp | undefined),
            totalScore,
            totalItems,
          };
        });

        // ✅ Combine + sort newest first
        const combined = [...attemptsRows, ...resultsRows].sort((a, b) => {
          const ta = a.submittedAt?.getTime?.() ?? 0;
          const tb = b.submittedAt?.getTime?.() ?? 0;
          return tb - ta;
        });

        setRows(combined);
      } catch (err) {
        console.error('Error loading dashboard submissions:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className="min-h-screen bg-base-200 px-4 py-8">
      <div className="max-w-5xl mx-auto bg-base-100 border border-base-300 rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Reading Exam Dashboard
            </h1>
            <p className="text-sm text-gray-700">
              Showing submissions from <span className="font-semibold">both</span>{' '}
              old and new reading flows.
            </p>
          </div>
          <button
            className="btn btn-outline btn-sm md:btn-md"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-700">Loading submissions…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-gray-700">
            No reading exam submissions found yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm md:table-md">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Exam</th>
                  <th className="hidden md:table-cell">Email</th>
                  <th className="hidden md:table-cell">Teacher</th>
                  <th>Score</th>
                  <th>Date</th>
                  <th className="hidden md:table-cell">Source</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={`${row.source}-${row.id}`}>
                    <td>
                      <div className="font-semibold">{row.studentName}</div>
                      <div className="text-xs md:hidden text-gray-600">
                        {row.studentEmail}
                      </div>
                    </td>
                    <td className="text-xs md:text-sm">
                      {row.examName || row.examId || '—'}
                    </td>
                    <td className="hidden md:table-cell text-xs">
                      {row.studentEmail}
                    </td>
                    <td className="hidden md:table-cell text-xs">
                      {row.teacherName || '—'}
                    </td>
                    <td className="text-xs md:text-sm">
                      {row.totalScore != null && row.totalItems != null ? (
                        <span className="font-semibold text-primary">
                          {row.totalScore}/{row.totalItems}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="text-xs">
                      {row.submittedAt ? row.submittedAt.toLocaleString() : '—'}
                    </td>
                    <td className="hidden md:table-cell text-xs">
                      {row.source === 'attempts' ? 'Attempts' : 'Results'}
                    </td>
                    <td className="text-right">
                      {/* ✅ pass source so detail page knows where to read */}
                      <Link
                        href={`/reading-dashboard/${row.id}?source=${row.source}`}
                        className="btn btn-xs md:btn-sm btn-primary"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}



