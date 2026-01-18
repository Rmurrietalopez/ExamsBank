'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex1';

const mcQuestions = [
  {
    id: 'Q1',
    question: '1. Jack is writing to ________.',
    options: [
      { id: 'A', label: 'A) advise his friend' },
      { id: 'B', label: 'B) confirm an appointment' },
      { id: 'C', label: 'C) express his apologies' },
      { id: 'D', label: 'D) refuse an invitation' },
    ],
  },
  {
    id: 'Q2',
    question: '2. Jack and his wife have decided ________.',
    options: [
      { id: 'A', label: 'A) to experience more in life' },
      { id: 'B', label: 'B) to make more money in China' },
      { id: 'C', label: 'C) to learn a new language' },
      { id: 'D', label: 'D) to change their jobs' },
    ],
  },
  {
    id: 'Q3',
    question: '3. Becky and Ralph ________.',
    options: [
      { id: 'A', label: 'A) are planning to travel to Toronto' },
      { id: 'B', label: 'B) have not gotten married yet' },
      { id: 'C', label: 'C) have not met Jack before' },
      { id: 'D', label: 'D) may get married soon' },
    ],
  },
  {
    id: 'Q4',
    question: '4. Regarding China, Jack is mostly concerned about ________.',
    options: [
      { id: 'A', label: 'A) his housing situation' },
      { id: 'B', label: 'B) teaching in front of people' },
      { id: 'C', label: 'C) living in a foreign country' },
      { id: 'D', label: 'D) his English grammar knowledge' },
    ],
  },
  {
    id: 'Q5',
    question: '5. Ralph and Jack ________.',
    options: [
      { id: 'A', label: 'A) have met recently in college' },
      { id: 'B', label: 'B) used to work together in Toronto' },
      { id: 'C', label: 'C) have not known each other for a long time' },
      { id: 'D', label: 'D) knew Becky from college' },
    ],
  },
  {
    id: 'Q6',
    question: '6. Ralph plans to send a wedding gift ________.',
    options: [
      { id: 'A', label: 'A) before he goes to China' },
      { id: 'B', label: 'B) after he meets Becky in Toronto' },
      { id: 'C', label: 'C) after he arrived in Beijing' },
      { id: 'D', label: 'D) before the wedding takes place' },
    ],
  },
];

type BlankId = 'BLANK7' | 'BLANK8' | 'BLANK9' | 'BLANK10' | 'BLANK11';

const completionOptions: Record<
  BlankId,
  { number: number; options: { id: 'a' | 'b' | 'c' | 'd'; label: string }[] }
> = {
  BLANK7: {
    number: 7,
    options: [
      { id: 'a', label: 'coming to the wedding' },
      { id: 'b', label: 'moving to Beijing' },
      { id: 'c', label: 'missing out on my wedding' },
      { id: 'd', label: 'travelling to China' },
    ],
  },
  BLANK8: {
    number: 8,
    options: [
      { id: 'a', label: 'a college reunion' },
      { id: 'b', label: 'a High School party' },
      { id: 'c', label: 'an interesting trip' },
      { id: 'd', label: 'a college moment' },
    ],
  },
  BLANK9: {
    number: 9,
    options: [
      { id: 'a', label: 'you’re quitting your teaching job' },
      { id: 'b', label: 'coming to Toronto next summer' },
      { id: 'c', label: 'leaving Beijing after one year' },
      { id: 'd', label: 'you’re relocating to another country' },
    ],
  },
  BLANK10: {
    number: 10,
    options: [
      { id: 'a', label: 'helps you teach grammar' },
      { id: 'b', label: 'makes a friendly teacher' },
      { id: 'c', label: 'is important in China' },
      { id: 'd', label: 'gives you lots of knowledge' },
    ],
  },
  BLANK11: {
    number: 11,
    options: [
      { id: 'a', label: 'send you something' },
      { id: 'b', label: 'be taking care of a present' },
      { id: 'c', label: 'be on the look out for something' },
      { id: 'd', label: 'buy something beautiful' },
    ],
  },
};

const blankIds: BlankId[] = [
  'BLANK7',
  'BLANK8',
  'BLANK9',
  'BLANK10',
  'BLANK11',
];

export default function ReadingExam3Ex1Page() {
  const router = useRouter();
  const { answers, setAnswer } = useReadingExam();
  const [error, setError] = useState<string | null>(null);

  const currentAnswers = answers[EXERCISE_ID] || {};

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const requiredMcIds = mcQuestions.map((q) => q.id);
    const allMcAnswered = requiredMcIds.every((id) => currentAnswers[id]);
    const allBlanksAnswered = blankIds.every((id) => currentAnswers[id]);

    if (!allMcAnswered || !allBlanksAnswered) {
      setError('Please answer all questions before continuing.');
      return;
    }

    router.push('/reading/exam3/ex2');
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
        <option value="">
          {data.number}. Choose...
        </option>
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
      <div className="w-full max-w-4xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-10 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
            Reading Exam 3 · Part 1
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Reading Correspondence
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            You will read a short exchange of emails. Answer questions about
            content, tone, and purpose.
          </p>
        </header>

        {/* Original message from Jack */}
        <section className="space-y-3 text-sm md:text-base">
          <h2 className="text-sm font-semibold text-[#1f2933]">Message</h2>
          <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-2 text-gray-900">
            <p>Dear Ralph,</p>
            <p>
              Your wedding invitation just arrived in the mail yesterday, and I
              want to send my warmest congrats to you and your fiancé! That
              makes sense. I thought you’d be the last one of your college
              friends to get married. I haven’t seen you in a long time, and
              I’ve never even met Becky, the woman you’re going to marry.
            </p>
            <p>
              My wife Jenny and I are going to China next month, so I won’t be
              able to make it to your wedding in Toronto. The English teacher
              jobs at a well-known private language school in downtown Beijing
              have been filled. Even though I have an English degree, I’ve never
              taught before. Jenny has, though, and she tells me I’d be a great
              teacher. I feel nervous about speaking in front of all those kids,
              and I worry that my English isn’t perfect! In high school, I used
              to get stage fright when I had to show papers with it. It will be
              hard, but we think it will be a good learning experience for both
              of us.
            </p>
            <p>
              Lucky for us, John Blackwell, someone I’ve known for a long time,
              currently lives in Beijing. There, he works as a photographer for
              an English-language newspaper and has helped us find an apartment
              to rent in his building. It’s not too far from the school where
              we’ll be teaching. It seems pretty big, but nothing compared to
              the comfort and ease of life in a Canadian neighbourhood.
            </p>
            <p>
              But Jenny and I are lucky that we don’t have to worry about our
              housing or income. We’re mostly interested in this because it
              gives us a chance to see the world from a different point of view
              and escape our North American bubble. That being said, I’m really
              sad that I won’t be able to attend your wedding and meet Becky. I
              do plan to visit my younger sister in Toronto after I return from
              Beijing next summer, though, so I’ll make plans later to catch you
              both then.
            </p>
            <p>
              We were going to send you a wedding gift with this note, but Jenny
              thought we should take something special from China instead. I’m
              not good at shopping, so Jenny can choose something nice for me.
              Remember how badly my dorm room was decorated?
            </p>
            <p>Once again, congratulations to you and Becky.</p>
            <p>Jack</p>
          </div>
        </section>

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

          {/* Correspondence / completions 7–11 with inline dropdowns */}
          <section className="space-y-4">
            <h2 className="text-sm md:text-base font-semibold text-[#1f2933]">
              Correspondence (Questions 7–11)
            </h2>

            <p className="text-xs md:text-sm text-gray-700">
              Use the dropdowns in the text to choose the best option for each
              blank (7–11).
            </p>

            <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-2 text-sm md:text-base text-gray-900">
              <p>Dear Jack,</p>
              <p>
                It’s so good to hear from you, but I’m upset you’re
                {renderBlankSelect('BLANK7')}.
              </p>
              <p>
                It would’ve been so great because many of our college friends
                will be there, so it was kind of going to be
                {renderBlankSelect('BLANK8')}.
              </p>
              <p>
                But, I think it’s wonderful
                {renderBlankSelect('BLANK9')}, I have no doubt that it’ll be a
                great learning experience. I wouldn’t be really worried about
                the teaching part because I know you’re outgoing, which
                {renderBlankSelect('BLANK10')}.
              </p>
              <p>
                Anyway, message me soon and let me know how things are there,
                and I’ll
                {renderBlankSelect('BLANK11')}
                from China, and of course, can’t wait for your visit in Toronto
                soon.
              </p>
              <p>All the best,</p>
              <p>Ralph</p>
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

