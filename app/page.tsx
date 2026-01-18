import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-8 md:p-12 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
            Go CELPIP · Practice Center
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1f2933]">
            Welcome to your Go CELPIP Exam Bank
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            Here you can practice CELPIP-style exams created exclusively by{' '}
            <span className="font-semibold text-[#d40000]">Go CELPIP</span>.
            Please choose the skill you need to practice. Your teacher will tell
            you which specific exam to take.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[#1f2933]">
            Choose the skill you need to practice:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {/* Reading */}
            <Link
              href="/reading"
              className="group rounded-2xl border border-[#c4baad] bg-[#fffcf9] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#1f2933] flex items-center gap-2">
                  Reading Exams Bank
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#d40000] text-white">
                    Active
                  </span>
                </h3>
                <p className="mt-2 text-sm text-gray-700">
                  Practice full reading exams that mirror CELPIP question types.
                  Your teacher will indicate which exam number to complete.
                </p>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#d40000] group-hover:underline">
                View reading exams →
              </p>
            </Link>

            {/* Listening */}
            <Link
              href="/listening"
              className="group rounded-2xl border border-dashed border-[#c4baad] bg-[#fffcf9] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#1f2933]">
                  Listening Exams Bank
                </h3>
                <p className="mt-2 text-sm text-gray-700">
                  Listening practice exams will be available here soon. Your
                  teacher will let you know when this section is ready.
                </p>
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-500 group-hover:underline">
                Coming soon →
              </p>
            </Link>

            {/* Writing */}
            <Link
              href="/writing"
              className="group rounded-2xl border border-dashed border-[#c4baad] bg-[#fffcf9] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#1f2933]">
                  Writing Exams Bank
                </h3>
                <p className="mt-2 text-sm text-gray-700">
                  Here you will find writing tasks similar to the official
                  CELPIP exam, with personalized feedback from your teacher.
                </p>
              </div>
              <p className="mt-4 text-sm font-semibold text-gray-500 group-hover:underline">
                Coming soon →
              </p>
            </Link>

            {/* Speaking (ACTIVE now) */}
            <Link
              href="/speaking"
              className="group rounded-2xl border border-[#c4baad] bg-[#fffcf9] p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#1f2933] flex items-center gap-2">
                  Speaking Exams Bank
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#d40000] text-white">
                    Active
                  </span>
                </h3>
                <p className="mt-2 text-sm text-gray-700">
                  Record and submit your speaking answers so your teacher can
                  review them and give feedback.
                </p>
              </div>
              <p className="mt-4 text-sm font-semibold text-[#d40000] group-hover:underline">
                View speaking exams →
              </p>
            </Link>
          </div>
        </section>

        <footer className="pt-4 border-t border-[#e0d6c7] text-xs text-gray-600">
          If you are not sure which exam to complete, please ask your{' '}
          <span className="font-semibold">Go CELPIP</span> teacher for
          instructions.
        </footer>
      </div>
    </main>
  );
}


