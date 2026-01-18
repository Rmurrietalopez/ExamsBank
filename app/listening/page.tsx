import Link from 'next/link';

export default function ListeningBankComingSoonPage() {
  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-8 space-y-6 text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
          Listening Exams Bank – Coming Soon
        </h1>
        <p className="text-sm md:text-base text-gray-800">
          The Listening Exam Bank is not available yet. We are preparing
          listening practice with audio and CELPIP-style questions.
        </p>
        <p className="text-xs text-gray-700">
          Your teacher will let you know when this section is ready to use.
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
