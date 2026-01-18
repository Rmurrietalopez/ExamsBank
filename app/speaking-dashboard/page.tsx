'use client';

import { useEffect, useState } from 'react';
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

type SpeakingDashboardRow = {
  id: string;
  studentName: string;
  studentEmail: string;
  teacherName?: string;
  examId?: string;
  examName?: string;
  createdAt?: Date;
  submittedAt?: Date;
  tasksCount?: number;
};

function toDateMaybe(v: any): Date | undefined {
  if (!v) return undefined;
  if (v instanceof Date) return v;
  if (typeof v === 'string') {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  // Firestore Timestamp
  if (v?.toDate) return v.toDate();
  return undefined;
}

export default function SpeakingDashboardPage() {
  const [rows, setRows] = useState<SpeakingDashboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ Most reliable: order by createdAt (exists for all attempts)
        // then filter only submitted ones in code.
        const q = query(
          collection(db, 'speakingExamAttempts'),
          orderBy('createdAt', 'desc'),
          limit(100)
        );

        const snap = await getDocs(q);

        const mapped: SpeakingDashboardRow[] = snap.docs
          .map((docSnap) => {
            const data = docSnap.data() as any;

            const createdAt = toDateMaybe(data.createdAt as Timestamp | string | undefined);
            const submittedAt = toDateMaybe(data.submittedAt as Timestamp | string | undefined);

            return {
              id: docSnap.id,
              studentName: data.studentName ?? 'Unknown',
              studentEmail: data.studentEmail ?? '',
              teacherName: data.teacherName ?? '',
              examId: data.examId ?? undefined,
              examName: data.examName ?? undefined,
              createdAt,
              submittedAt,
              tasksCount: Array.isArray(data.tasks) ? data.tasks.length : undefined,
            };
          })
          // ✅ show only completed/submitted attempts
          .filter((r) => Boolean(r.submittedAt));

        setRows(mapped);
      } catch (err) {
        console.error('Error loading speakingExamAttempts:', err);
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
              Speaking Exam Dashboard
            </h1>
            <p className="text-sm text-gray-700">
              Submissions from <span className="font-semibold">speaking</span> exams (audio + prompts).
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
          <p className="text-sm text-gray-700">No speaking submissions found yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-sm md:table-md">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Exam</th>
                  <th className="hidden md:table-cell">Email</th>
                  <th className="hidden md:table-cell">Teacher</th>
                  <th>Tasks</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
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
                      {row.tasksCount != null ? row.tasksCount : '—'}
                    </td>
                    <td className="text-xs">
                      {row.submittedAt ? row.submittedAt.toLocaleString() : '—'}
                    </td>
                    <td className="text-right">
                      <Link
                        href={`/speaking-dashboard/${row.id}`}
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
