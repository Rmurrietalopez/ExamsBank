'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXAM_ID = 'reading-exam-1';

const TEACHERS = [
  'Miss Vero',
  'Miss Romi',
  'Miss Cami',
  'Miss Lucre',
  'Miss Andrea',
  'Miss Yanina',
];

export default function ReadingExam1WelcomePage() {
  const router = useRouter();
  const { startExam } = useReadingExam();

  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentName.trim() || !email.trim() || !teacherName.trim()) {
      setError('Please fill in all fields before starting the exam.');
      return;
    }

    try {
      setSubmitting(true);

      await startExam({
        examId: EXAM_ID,
        studentName: studentName.trim(),
        email: email.trim(),
        teacherName: teacherName.trim(),
      });

      router.push('/reading/exam1/ex1');
    } catch (err) {
      console.error('Error starting Reading Exam 1:', err);
      setError('There was a problem starting the exam. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-[#fffcf9] border border-[#c4baad] shadow-xl rounded-3xl p-8 md:p-10 space-y-6">
        {/* Top bar with back link */}
        <div className="flex items-center justify-between gap-2 text-xs md:text-sm">
          <Link
            href="/reading"
            className="inline-flex items-center gap-1 text-gray-700 hover:text-[#d40000] transition-colors"
          >
            ← Back to Reading Exams Bank
          </Link>
          <span className="px-2 py-1 rounded-full bg-[#d40000] text-white text-[10px] uppercase tracking-wide">
            Reading Exam 1
          </span>
        </div>

        <header className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Reading Exam 1
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            This exam is designed to help you practice the{' '}
            <strong>CELPIP Reading</strong> section. Please enter your details
            before starting. Your teacher will see your results and contact you
            with feedback.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Full Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full rounded-md border border-[#c4baad] bg-[#fffcf9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d40000]"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[#c4baad] bg-[#fffcf9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d40000]"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-800">
              Choose your teacher
            </label>
            <select
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full rounded-md border border-[#c4baad] bg-[#fffcf9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d40000]"
            >
              <option value="">Select a teacher</option>
              {TEACHERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-md bg-[#d40000] text-white text-sm font-semibold hover:bg-[#ba0000] transition-colors disabled:opacity-70"
            >
              {submitting ? 'Starting exam…' : 'Start Exam'}
            </button>

            <Link
              href="/reading"
              className="px-5 py-2.5 rounded-md border border-[#c4baad] text-sm font-semibold text-[#1f2933] bg-[#fffcf9] hover:bg-[#f2eddb] transition-colors"
            >
              Back to Reading Exams Bank
            </Link>
          </div>
        </form>

        <p className="text-[11px] text-gray-600 mt-2">
          Make sure you are in a quiet place and have enough time to complete
          the full exam before you begin.
        </p>
      </div>
    </main>
  );
}


