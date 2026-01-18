import Link from 'next/link';

const READING_EXAMS = [
  {
    id: 1,
    label: 'Reading Exam 1',
    href: '/reading/exam1',
    status: 'ready' as const,
  },
  {
    id: 2,
    label: 'Reading Exam 2',
    href: '/reading/exam2',
    status: 'ready' as const,
  },
  {
    id: 3,
    label: 'Reading Exam 3',
    href: '/reading/exam3',
    status: 'ready' as const,
  },
  {
    id: 4,
    label: 'Reading Exam 4',
    href: '/reading/exam4',
    status: 'ready' as const,
  },
  {
    id: 5,
    label: 'Reading Exam 5',
    href: '/reading/coming-soon',
    status: 'coming-soon' as const,
  },
  {
    id: 6,
    label: 'Reading Exam 6',
    href: '/reading/coming-soon',
    status: 'coming-soon' as const,
  },
  {
    id: 7,
    label: 'Reading Exam 7',
    href: '/reading/coming-soon',
    status: 'coming-soon' as const,
  },
  {
    id: 8,
    label: 'Reading Exam 8',
    href: '/reading/coming-soon',
    status: 'coming-soon' as const,
  },
];


export default function ReadingExamsBankPage() {
  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-8 md:p-10 space-y-6">
        <header className="space-y-2">
          <Link
            href="/"
            className="text-xs text-gray-600 hover:text-[#d40000] mb-1 inline-block"
          >
            ← Back to Home
          </Link>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Reading Exams Bank
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            Please choose the reading exam your teacher has assigned to you.
            Each exam follows the structure and difficulty of the official
            CELPIP Reading section.
          </p>
          <p className="text-xs text-gray-700 mt-1">
            If you are not sure which exam number to select, ask your teacher
            before starting.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#ba8437]">
            Available Reading Exams
          </h2>

          <div className="space-y-3">
            {READING_EXAMS.map((exam) => (
              <Link
                key={exam.id}
                href={exam.href}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm md:text-base transition-all ${
                  exam.status === 'ready'
                    ? 'border-[#c4baad] bg-[#fffcf9] hover:shadow-md hover:-translate-y-0.5'
                    : 'border-dashed border-[#c4baad] bg-[#fffcf9] hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-[#1f2933]">
                    {exam.label}
                  </span>
                  <span className="text-xs text-gray-700">
                    {exam.status === 'ready'
                      ? 'Exam available · click to start'
                      : 'We are working on this exam · coming soon'}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    exam.status === 'ready'
                      ? 'bg-[#d40000] text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {exam.status === 'ready' ? 'Ready' : 'Coming soon'}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

