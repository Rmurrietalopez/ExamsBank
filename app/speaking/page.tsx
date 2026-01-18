import Link from 'next/link';

const SPEAKING_EXAMS = [
  {
    id: 'exam1',
    title: 'Speaking Exam 1',
    subtitle: 'Single-page speaking practice (record + submit)',
    href: '/speaking/exam1',
  },
  {
    id: 'exam2',
    title: 'Speaking Exam 2',
    subtitle: 'Single-page speaking practice (record + submit)',
    href: '/speaking/exam2',
  },
  {
    id: 'exam3',
    title: 'Speaking Exam 3',
    subtitle: 'Single-page speaking practice (record + submit)',
    href: '/speaking/exam3',
  },
  {
    id: 'exam4',
    title: 'Speaking Exam 4',
    subtitle: 'Single-page speaking practice (record + submit)',
    href: '/speaking/exam4',
  },
];

export default function SpeakingBankPage() {
  return (
    <main className="min-h-screen bg-[#f2eddb] px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-10">
          <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
            Go CELPIP · Speaking
          </p>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#1f2933] mt-2">
            Speaking Exams Bank
          </h1>
          <p className="text-sm md:text-base text-gray-800 mt-2 max-w-2xl">
            Choose a speaking exam to practice. You’ll record your answers and
            submit them so your teacher can review and give feedback.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-md border border-[#c4baad] text-sm font-semibold text-[#1f2933] bg-[#fffcf9] hover:bg-[#f2eddb] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {SPEAKING_EXAMS.map((exam) => (
            <Link
              key={exam.id}
              href={exam.href}
              className="group bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-lg p-6 md:p-7 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <h2 className="text-lg md:text-xl font-extrabold text-[#1f2933] group-hover:text-[#d40000] transition-colors">
                    {exam.title}
                  </h2>
                  <p className="text-sm text-gray-700">{exam.subtitle}</p>
                </div>

                <span className="px-2 py-1 rounded-full bg-[#d40000] text-white text-[10px] uppercase tracking-wide shrink-0">
                  Start
                </span>
              </div>

              <div className="mt-4 text-sm font-semibold text-[#d40000]">
                Open exam →
              </div>
            </Link>
          ))}
        </section>

        <footer className="text-xs text-gray-600">
          Tip: Use a computer with a stable internet connection for the best
          recording experience.
        </footer>
      </div>
    </main>
  );
}

