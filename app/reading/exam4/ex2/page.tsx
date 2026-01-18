'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex2';

/* =====================
   Dropdown blanks 1–5
===================== */
type BlankId = 'BLANK1' | 'BLANK2' | 'BLANK3' | 'BLANK4' | 'BLANK5';

const blankIds: BlankId[] = [
  'BLANK1',
  'BLANK2',
  'BLANK3',
  'BLANK4',
  'BLANK5',
];

const completionOptions: Record<
  BlankId,
  { number: number; options: { id: 'a' | 'b' | 'c' | 'd'; label: string }[] }
> = {
  BLANK1: {
    number: 1,
    options: [
      { id: 'a', label: 'overwhelming' },
      { id: 'b', label: 'confusing' },
      { id: 'c', label: 'approachable' },
      { id: 'd', label: 'insignificant' },
    ],
  },
  BLANK2: {
    number: 2,
    options: [
      { id: 'a', label: 'completions' },
      { id: 'b', label: 'sign-ups' },
      { id: 'c', label: 'lessons' },
      { id: 'd', label: 'attempts' },
    ],
  },
  BLANK3: {
    number: 3,
    options: [
      { id: 'a', label: 'inflexible schedules' },
      { id: 'b', label: 'strict deadlines' },
      { id: 'c', label: 'busy routines' },
      { id: 'd', label: 'inconvenient plans' },
    ],
  },
  BLANK4: {
    number: 4,
    options: [
      { id: 'a', label: 'transform' },
      { id: 'b', label: 'suppress' },
      { id: 'c', label: 'confuse' },
      { id: 'd', label: 'overlook' },
    ],
  },
  BLANK5: {
    number: 5,
    options: [
      { id: 'a', label: 'challenge' },
      { id: 'b', label: 'journey' },
      { id: 'c', label: 'obligation' },
      { id: 'd', label: 'task' },
    ],
  },
};

/* =====================
   MC Questions 6–8
===================== */
const mcQuestions = [
  {
    id: 'Q6',
    question: '6. Emily’s email shows that she values ________ in learning experiences.',
    options: [
      { id: 'A', label: 'A) Flexibility' },
      { id: 'B', label: 'B) Structure' },
      { id: 'C', label: 'C) Independence' },
      { id: 'D', label: 'D) Creativity' },
    ],
  },
  {
    id: 'Q7',
    question:
      '7. The mention of “teamwork and critical thinking” suggests that Emily believes Sophia will benefit from ________.',
    options: [
      { id: 'A', label: 'A) Collaboration and problem-solving skills' },
      { id: 'B', label: 'B) Technical expertise' },
      { id: 'C', label: 'C) Individual achievement' },
      { id: 'D', label: 'D) Theoretical knowledge' },
    ],
  },
  {
    id: 'Q8',
    question:
      '8. Emily seems to recommend the program because she believes it will ________.',
    options: [
      { id: 'A', label: 'A) Provide a quick introduction to coding' },
      { id: 'B', label: 'B) Offer a unique and engaging learning experience' },
      { id: 'C', label: 'C) Focus primarily on technical skills' },
      { id: 'D', label: 'D) Challenge Sophia with difficult concepts' },
    ],
  },
];

export default function ReadingExam4Ex2Page() {
  const router = useRouter();
  const { answers, setAnswer } = useReadingExam();
  const [error, setError] = useState<string | null>(null);

  const currentAnswers = answers[EXERCISE_ID] || {};

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const allBlanksAnswered = blankIds.every((id) => currentAnswers[id]);
    const allMcAnswered = mcQuestions.every((q) => currentAnswers[q.id]);

    if (!allBlanksAnswered || !allMcAnswered) {
      setError('Please answer all questions before continuing.');
      return;
    }

    router.push('/reading/exam4/ex3');
  };

  const renderBlankSelect = (blankId: BlankId) => {
    const data = completionOptions[blankId];
    const value = (currentAnswers[blankId] as string | undefined) || '';

    return (
      <select
        value={value}
        onChange={(e) =>
          setAnswer(EXERCISE_ID, blankId, e.target.value as 'a' | 'b' | 'c' | 'd')
        }
        className="mx-1 rounded-md border border-[#c4baad] bg-[#fffcf9] px-2 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#d40000]"
      >
        <option value="">{data.number}. Choose...</option>
        {data.options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.id}) {opt.label}
          </option>
        ))}
      </select>
    );
  };

  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-10 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
            Reading Exam 4 · Part 2
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Reading to Apply a Diagram
          </h1>
        </header>

        {/* IMAGE */}
        <section>
          <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] p-4 flex justify-center">
            <Image
              src="/ImageExam4.png"
              alt="Reading Exam 4 Diagram"
              width={700}
              height={450}
              className="rounded-lg object-contain"
              priority
            />
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* TEXT WITH DROPDOWNS 1–5 */}
          <section className="space-y-3 text-sm md:text-base">
            <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-2 text-gray-900">
              <p>To: Jonathan@example.com</p>
              <p>From: Emily@example.com</p>

              <p className="pt-2">Hi Jonathan,</p>

              <p>
                The best part is how the lessons unfold naturally, with expert
                instructors making sure even the trickiest concepts feel
                {renderBlankSelect('BLANK1')}.
              </p>

              <p>
                If you’re quick, there’s also a discount for early enrollment
                and a starter kit with coding tools for the first few
                {renderBlankSelect('BLANK2')}. Since it’s all virtual, it fits
                easily into {renderBlankSelect('BLANK3')} without the hassle of
                commuting. It’s more than just a class—it’s a doorway to a world
                where she can {renderBlankSelect('BLANK4')} her natural curiosity
                into something tangible.
              </p>

              <p>
                I’d love to help Sophia get started on this exciting
                {renderBlankSelect('BLANK5')}!
              </p>

              <p className="pt-2">Best regards,<br />Emily</p>
            </div>
          </section>

          {/* MC QUESTIONS 6–8 (UNCHANGED) */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-[#1f2933]">
              Questions 6–8
            </h2>

            {mcQuestions.map((q) => (
              <div key={q.id} className="space-y-2">
                <p className="font-medium">{q.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer ${
                        currentAnswers[q.id] === opt.id
                          ? 'border-[#d40000] bg-[#fcebea]'
                          : 'border-[#c4baad]'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={currentAnswers[q.id] === opt.id}
                        onChange={() =>
                          setAnswer(EXERCISE_ID, q.id, opt.id)
                        }
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <button className="px-5 py-2.5 rounded-md bg-[#d40000] text-white font-semibold">
              Next: Part 3
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}


