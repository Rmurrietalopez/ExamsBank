'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex1';

/* =====================
   Multiple Choice Q1–6
===================== */
const mcQuestions = [
  {
    id: 'Q1',
    question: '1. Megan values ________.',
    options: [
      { id: 'A', label: 'A) Relaxation' },
      { id: 'B', label: 'B) Famous landmarks' },
      { id: 'C', label: 'C) Fun and learning' },
      { id: 'D', label: 'D) Luxury' },
    ],
  },
  {
    id: 'Q2',
    question: '2. Megan’s letter suggests she ________.',
    options: [
      { id: 'A', label: 'A) Loves sharing experiences' },
      { id: 'B', label: 'B) Focuses on facts' },
      { id: 'C', label: 'C) Prefers solo travel' },
      { id: 'D', label: 'D) Avoids new things' },
    ],
  },
  {
    id: 'Q3',
    question: '3. Florence highlights Megan’s interest in ________.',
    options: [
      { id: 'A', label: 'A) Wine' },
      { id: 'B', label: 'B) Art and history' },
      { id: 'C', label: 'C) Landmarks only' },
      { id: 'D', label: 'D) Rural life' },
    ],
  },
  {
    id: 'Q4',
    question: '4. Megan’s gondola ride shows she ________.',
    options: [
      { id: 'A', label: 'A) Avoids clichés' },
      { id: 'B', label: 'B) Enjoys iconic activities' },
      { id: 'C', label: 'C) Seeks privacy' },
      { id: 'D', label: 'D) Dislikes crowds' },
    ],
  },
  {
    id: 'Q5',
    question: '5. Megan views food as ________.',
    options: [
      { id: 'A', label: 'A) Central to travel' },
      { id: 'B', label: 'B) Unimportant' },
      { id: 'C', label: 'C) Too elaborate' },
      { id: 'D', label: 'D) Secondary' },
    ],
  },
  {
    id: 'Q6',
    question: '6. Megan suggests Asia to ________.',
    options: [
      { id: 'A', label: 'A) Try something new' },
      { id: 'B', label: 'B) Avoid Europe' },
      { id: 'C', label: 'C) Make planning easier' },
      { id: 'D', label: 'D) Please Sarah' },
    ],
  },
];

/* =====================
   Dropdown Blanks 7–11
===================== */
type BlankId = 'BLANK7' | 'BLANK8' | 'BLANK9' | 'BLANK10' | 'BLANK11';

const blankIds: BlankId[] = [
  'BLANK7',
  'BLANK8',
  'BLANK9',
  'BLANK10',
  'BLANK11',
];

const completionOptions: Record<
  BlankId,
  { number: number; options: { id: 'a' | 'b' | 'c' | 'd'; label: string }[] }
> = {
  BLANK7: {
    number: 7,
    options: [
      { id: 'a', label: 'ordinary' },
      { id: 'b', label: 'dreadful' },
      { id: 'c', label: 'incredible' },
      { id: 'd', label: 'exhausting' },
    ],
  },
  BLANK8: {
    number: 8,
    options: [
      { id: 'a', label: 'there' },
      { id: 'b', label: 'alone' },
      { id: 'c', label: 'far' },
      { id: 'd', label: 'watching' },
    ],
  },
  BLANK9: {
    number: 9,
    options: [
      { id: 'a', label: 'hated' },
      { id: 'b', label: 'avoided' },
      { id: 'c', label: 'enjoyed' },
      { id: 'd', label: 'ignored' },
    ],
  },
  BLANK10: {
    number: 10,
    options: [
      { id: 'a', label: 'event' },
      { id: 'b', label: 'meal' },
      { id: 'c', label: 'adventure' },
      { id: 'd', label: 'activity' },
    ],
  },
  BLANK11: {
    number: 11,
    options: [
      { id: 'a', label: 'soon' },
      { id: 'b', label: 'rarely' },
      { id: 'c', label: 'never' },
      { id: 'd', label: 'tomorrow' },
    ],
  },
};

export default function ReadingExam4Ex1Page() {
  const router = useRouter();
  const { answers, setAnswer } = useReadingExam();
  const [error, setError] = useState<string | null>(null);

  const currentAnswers = answers[EXERCISE_ID] || {};

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const allMcAnswered = mcQuestions.every((q) => currentAnswers[q.id]);
    const allBlanksAnswered = blankIds.every((id) => currentAnswers[id]);

    if (!allMcAnswered || !allBlanksAnswered) {
      setError('Please answer all questions before continuing.');
      return;
    }

    router.push('/reading/exam4/ex2');
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
            Reading Exam 4 · Part 1
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Reading Correspondence
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            You will read a short exchange of emails. Answer questions about
            content, tone, and purpose.
          </p>
        </header>

        {/* ✅ ONLY Megan’s email here */}
        <section className="space-y-3 text-sm md:text-base">
          <h2 className="text-sm font-semibold text-[#1f2933]">Email 1</h2>
          <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-3 text-gray-900">
            <p>Dear Sarah,</p>

            <p>
              I hope you’re doing well! I just got back from an amazing two-week
              vacation in Italy, and I couldn’t wait to share all the highlights
              with you. It was truly an unforgettable experience, and I think
              it’s one of the best trips I’ve ever taken.
            </p>

            <p>
              We started our journey in Rome, where we explored some of the most
              iconic landmarks, including the Colosseum, the Roman Forum, and
              the Vatican. I was in awe of the architecture and history of the
              city. The highlight of our time in Rome was a night tour of the
              Colosseum, where we had the chance to explore the ancient arena
              after dark. The atmosphere was surreal, and I felt like I was
              stepping back in time.
            </p>

            <p>
              From Rome, we made our way to Florence, where we spent a couple of
              days admiring the incredible art and culture. We visited the
              Uffizi Gallery, which houses masterpieces by Botticelli, Leonardo
              da Vinci, and Michelangelo. The Florence Cathedral, with its
              stunning dome designed by Brunelleschi, was another highlight.
              We also took a day trip to the Tuscan countryside, where we had
              the chance to sample some of the region’s famous wines and olive
              oils. I can’t believe how beautiful the landscape was—it looked
              like something straight out of a painting.
            </p>

            <p>
              Our last stop was Venice, and I was blown away by how unique and
              charming the city is. We took a gondola ride through the canals,
              which was a bit touristy but still so fun. The food in Venice was
              outstanding, especially the fresh seafood. I think I ate my
              weight in pasta and seafood dishes! We also visited St. Mark’s
              Basilica, which was absolutely stunning. The mosaics on the walls
              were incredible, and the architecture was beyond anything I’ve
              ever seen.
            </p>

            <p>
              I wish you could have been there with me! I know you’d have loved
              every moment of it. We need to start planning our next trip
              together—maybe somewhere in Asia? Let me know your thoughts.
            </p>

            <p>Take care, and I’ll talk to you soon!</p>
            <p>Warmly,<br />Megan</p>
          </div>
        </section>

        {/* ✅ QUESTIONS: 1–6 THEN 7–11 */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Questions 1–6 */}
          <section className="space-y-4">
            <h2 className="text-sm md:text-base font-semibold text-[#1f2933]">
              Questions 1–6
            </h2>

            <div className="space-y-4">
              {mcQuestions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <p className="text-sm md:text-base font-medium text-[#1f2933]">
                    {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm md:text-base">
                    {q.options.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer ${
                          currentAnswers[q.id] === opt.id
                            ? 'border-[#d40000] bg-[#fcebea]'
                            : 'border-[#c4baad] bg-[#fffcf9]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt.id}
                          checked={currentAnswers[q.id] === opt.id}
                          onChange={() =>
                            setAnswer(EXERCISE_ID, q.id, opt.id as string)
                          }
                          className="h-4 w-4"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sarah email WITH dropdowns (Questions 7–11) */}
          <section className="space-y-3 text-sm md:text-base">
            <h2 className="text-sm font-semibold text-[#1f2933]">
              Questions 7–11
            </h2>
            <p className="text-xs md:text-sm text-gray-700">
              Complete the email below using the dropdowns.
            </p>

            <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-3 text-gray-900">
              <p>Dear Megan,</p>

              <p>
                It sounds like you had an {renderBlankSelect('BLANK7')} time in
                Italy! Your description of the Colosseum at night, the art in
                Florence, and the gondola ride in Venice makes me feel like I
                was {renderBlankSelect('BLANK8')} with you. I can only imagine
                how beautiful the landscapes must have been, especially in
                Tuscany.
              </p>

              <p>
                It’s great to hear you {renderBlankSelect('BLANK9')} the food
                too—nothing beats fresh Italian pasta and seafood! I’m glad you
                had such a memorable trip.
              </p>

              <p>
                I’d love to plan our next {renderBlankSelect('BLANK10')} together.
                Asia sounds amazing—let’s brainstorm some destinations! I’ll be
                in touch soon to start organizing.
              </p>

              <p>
                Looking forward to catching up more {renderBlankSelect('BLANK11')}.
              </p>

              <p>Warmly,<br />Sarah</p>
            </div>
          </section>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-md bg-[#d40000] text-white text-sm font-semibold hover:bg-[#ba0000] transition-colors"
            >
              Next: Part 2
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}






