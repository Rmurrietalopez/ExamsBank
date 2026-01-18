'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXAM_ID = 'reading-exam-3';

const TEACHERS = [
  'Miss Vero',
  'Miss Romi',
  'Miss Cami',
  'Miss Lucre',
  'Miss Andrea',
  'Miss Yanina',
];

export default function ReadingExam3WelcomePage() {
  const router = useRouter();
  const { startExam } = useReadingExam();

  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = studentName.trim();
    const trimmedEmail = email.trim();
    const trimmedTeacher = teacherName.trim();

    if (!trimmedName || !trimmedEmail || !trimmedTeacher) {
      setError('Please complete all fields before starting the exam.');
      return;
    }

    try {
      setSubmitting(true);
      await startExam({
        examId: EXAM_ID,
        studentName: trimmedName,
        email: trimmedEmail,
        teacherName: trimmedTeacher,
      });

      router.push('/reading/exam3/ex1');
    } catch (err) {
      console.error('Error starting reading exam 3:', err);
      setError('Something went wrong starting the exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-8 space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
            Reading Exam 3
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Welcome to Reading Exam 3
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            This exam has four parts: Reading Correspondence, Reading to Apply a
            Diagram, Reading for Information, and Reading for Viewpoints.
            Please enter your details below before you begin.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="studentName"
              className="text-sm font-medium text-[#1f2933]"
            >
              Student name
            </label>
            <input
              id="studentName"
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full rounded-md border border-[#c4baad] bg-[#fffcf9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d40000]"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[#1f2933]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[#c4baad] bg-[#fffcf9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d40000]"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="teacherName"
              className="text-sm font-medium text-[#1f2933]"
            >
              Teacher
            </label>
            <select
              id="teacherName"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full rounded-md border border-[#c4baad] bg-[#fffcf9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d40000]"
            >
              <option value="">Select your teacher</option>
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

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#d40000] text-white rounded-md text-sm font-semibold hover:bg-[#ba0000] transition-colors disabled:opacity-70"
            >
              {submitting ? 'Starting…' : 'Start Exam'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/reading')}
              className="px-4 py-2 border border-[#c4baad] text-sm rounded-md font-semibold text-[#1f2933] bg-[#fffcf9] hover:bg-[#f2eddb] transition-colors"
            >
              Back to Reading Exams Bank
            </button>
          </div>
        </form>

        <p className="text-[11px] text-gray-600 mt-2">
          Your answers will be saved and reviewed by your Go CELPIP teacher.
        </p>
      </div>
    </main>
  );
}
