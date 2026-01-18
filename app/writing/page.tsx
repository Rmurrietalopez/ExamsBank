import Link from 'next/link';

export default function WritingBankComingSoonPage() {
  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-8 space-y-6 text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
          Writing Exams Bank – Coming Soon
        </h1>
        <p className="text-sm md:text-base text-gray-800">
          The Writing Exam Bank is under construction. Soon you will be able to
          practice writing tasks with personalized feedback from your teacher.
        </p>
        <p className="text-xs text-gray-700">
          For now, follow your teacher&apos;s instructions for any writing
          practice.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-[#d40000] text-white text-sm font-semibold hover:bg-[#ba0000] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
