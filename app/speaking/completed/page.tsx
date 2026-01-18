'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSpeakingExam } from '@/context/SpeakingExamContext';

export default function SpeakingCompletedPage() {
  const router = useRouter();
  const { student, resetExam } = useSpeakingExam();

  const handleBackToBank = () => {
    resetExam();
    router.push('/speaking');
  };

  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-10 space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
            Speaking
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Exam submitted!
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            Your teacher will review your recordings and contact you with feedback.
          </p>
        </header>

        {student ? (
          <div className="border border-[#c4baad] rounded-2xl px-4 py-4 space-y-2">
            <p className="text-sm">
              <strong>Student:</strong> {student.studentName}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {student.email}
            </p>
            <p className="text-sm">
              <strong>Teacher:</strong> {student.teacherName}
            </p>
            <p className="text-xs text-gray-600 pt-2 border-t border-[#c4baad]">
              Attempt ID saved for teacher dashboard.
            </p>
          </div>
        ) : (
          <div className="text-sm text-gray-700 border border-[#c4baad] rounded-2xl px-4 py-3">
            Submission completed, but student info is not available in this view.
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-end pt-2">
          <button
            onClick={handleBackToBank}
            className="px-5 py-2.5 rounded-md bg-[#d40000] text-white text-sm font-semibold hover:bg-[#ba0000] transition-colors"
          >
            Back to Speaking Bank
          </button>

          <Link
            href="/speaking/exam1"
            className="px-5 py-2.5 rounded-md border border-[#c4baad] text-sm font-semibold text-[#1f2933] bg-[#fffcf9] hover:bg-[#f2eddb] transition-colors"
          >
            Try again
          </Link>
        </div>
      </div>
    </main>
  );
}
