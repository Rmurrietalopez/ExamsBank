import Link from 'next/link';

export default function ReadingComingSoonPage() {
  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-8 space-y-6 text-center">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
          Reading Exam – Coming Soon
        </h1>
        <p className="text-sm md:text-base text-gray-800">
          We are currently working on this reading exam. It will be available
          soon as part of the Go CELPIP Reading Exam Bank.
        </p>
        <p className="text-xs text-gray-700">
          If your teacher assigned you this exam number, please let them know it
          is not ready yet so they can choose another option.
        </p>

        <div className="flex justify-center gap-3 pt-2 text-sm">
          <Link
            href="/reading"
            className="px-4 py-2 rounded-md bg-[#d40000] text-white font-semibold hover:bg-[#ba0000] transition-colors"
          >
            Back to Reading Exams
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-md border border-[#c4baad] text-[#1f2933] bg-[#fffcf9] hover:bg-[#f2eddb] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
