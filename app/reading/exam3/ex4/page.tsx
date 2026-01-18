'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex4';

const mcQuestions = [
  {
    id: 'Q1',
    question:
      '1. Which statement accurately represents the article’s stance on organic food?',
    options: [
      {
        id: 'A',
        label: 'A) Organic food is definitely healthier due to its natural ingredients.',
      },
      {
        id: 'B',
        label: 'B) Organic farming produces crops with higher nutritional value.',
      },
      {
        id: 'C',
        label: 'C) Organic pesticides are safer than synthetic ones.',
      },
      {
        id: 'D',
        label:
          'D) The article questions the health claims associated with organic food.',
      },
    ],
  },
  {
    id: 'Q2',
    question:
      '2. According to the article, why is it mentioned that organic pesticides like Rotenone are problematic?',
    options: [
      {
        id: 'A',
        label: 'A) They are less effective than synthetic pesticides.',
      },
      {
        id: 'B',
        label: 'B) They have no impact on crop growth.',
      },
      {
        id: 'C',
        label: 'C) They are harmful to honeybees.',
      },
      {
        id: 'D',
        label: 'D) They are more expensive than synthetic pesticides.',
      },
    ],
  },
  {
    id: 'Q3',
    question:
      '3. What does the article suggest about the use of “all-natural” ingredients in products?',
    options: [
      {
        id: 'A',
        label: 'A) All-natural ingredients are always healthy and safe.',
      },
      {
        id: 'B',
        label:
          'B) Natural ingredients can be harmful, just like synthetic ones.',
      },
      {
        id: 'C',
        label:
          'C) All-natural products are guaranteed to have higher nutritional value.',
      },
      {
        id: 'D',
        label:
          'D) Natural ingredients are never used in the food industry.',
      },
    ],
  },
  {
    id: 'Q4',
    question:
      '4. Why do organic farmers believe that standard growers use more advanced goods?',
    options: [
      {
        id: 'A',
        label: 'A) To reduce the cost of production.',
      },
      {
        id: 'B',
        label: 'B) To increase the nutritional value of crops.',
      },
      {
        id: 'C',
        label: 'C) To eliminate the need for pesticides.',
      },
      {
        id: 'D',
        label:
          'D) To make more money by reducing chemicals and fertilizers.',
      },
    ],
  },
  {
    id: 'Q5',
    question:
      '5. According to the article, what does the use of synthetic fertilizers and chemicals in modern agriculture suggest?',
    options: [
      {
        id: 'A',
        label: 'A) They are completely biodegradable.',
      },
      {
        id: 'B',
        label: 'B) They have no impact on the environment.',
      },
      {
        id: 'C',
        label: 'C) They are not backed by decades of research.',
      },
      {
        id: 'D',
        label: 'D) They are considered harmful and dangerous.',
      },
    ],
  },
];

type BlankId = 'BLANK6' | 'BLANK7' | 'BLANK8' | 'BLANK9' | 'BLANK10';

const blankIds: BlankId[] = [
  'BLANK6',
  'BLANK7',
  'BLANK8',
  'BLANK9',
  'BLANK10',
];

const completionOptions: Record<
  BlankId,
  { number: number; options: { id: 'a' | 'b' | 'c' | 'd'; label: string }[] }
> = {
  BLANK6: {
    number: 6,
    options: [
      { id: 'a', label: 'misconceptions' },
      { id: 'b', label: 'reality' },
      { id: 'c', label: 'sincerity' },
      { id: 'd', label: 'actually' },
    ],
  },
  BLANK7: {
    number: 7,
    options: [
      { id: 'a', label: 'disproportion' },
      { id: 'b', label: 'composition' },
      { id: 'c', label: 'dissension' },
      { id: 'd', label: 'difference' },
    ],
  },
  BLANK8: {
    number: 8,
    options: [
      { id: 'a', label: 'doubtfully' },
      { id: 'b', label: 'risibly' },
      { id: 'c', label: 'incredibly' },
      { id: 'd', label: 'potentially' },
    ],
  },
  BLANK9: {
    number: 9,
    options: [
      { id: 'a', label: 'negligibleness' },
      { id: 'b', label: 'littleness' },
      { id: 'c', label: 'emphasis' },
      { id: 'd', label: 'immateriality' },
    ],
  },
  BLANK10: {
    number: 10,
    options: [
      { id: 'a', label: 'adulatory' },
      { id: 'b', label: 'honorific' },
      { id: 'c', label: 'critical' },
      { id: 'd', label: 'panegyrical' },
    ],
  },
};

export default function ReadingExam3Ex4Page() {
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
      setError('Please answer all questions before finishing the exam.');
      return;
    }

    router.push('/reading/exam3/completed');
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
      <div className="w-full max-w-5xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-10 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
            Reading Exam 3 · Part 4
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Reading for Viewpoints
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            You will read a text that presents different arguments about organic
            food. Answer questions about viewpoints and the author&apos;s
            attitude.
          </p>
        </header>

        {/* Main article text */}
        <section className="space-y-3 text-sm md:text-base">
          <h2 className="text-sm font-semibold text-[#1f2933]">Text</h2>
          <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-3 text-gray-900">
            <p>
              According to the National Review, two out of three Canadians think
              that organic food is healthier, even though there is no evidence
              to back this. The chemicals and genes in the same type of a plant
              stay the same even if it is grown in two different ways. One might
              be bigger than the other if one way of growing was more effective,
              but its genes, not how it was grown, determine what it is made of
              and what chemicals it contains.
            </p>
            <p>
              According to consumer reports, there was no consistent change in
              how things looked, tasted, or felt. It doesn’t make sense or be
              based on facts to say something like “organic farming produces
              crops with higher nutritional value.” Pesticide residues on
              non-organic food are said to be the cause of harm by people who
              support organic farming. What this claim says is even stranger. Up
              to seven times as much of the organic pesticides and fungicides
              have to be used because they don’t work as well as current
              synthetic ones. Rotenone, a natural poison used by some native
              tribes for hunting and known to cause Parkinson’s disease
              symptoms, is an example of an organic pesticide. Other examples
              include Pyrethrum, which can cause cancer, Sabadillia, which is
              very harmful to honeybees, and fermented urine, which I don’t want
              on my food no matter what it does to me.
            </p>
            <p>
              People who support organics say it’s okay to use a lot more
              chemicals because those chemicals come from nature. However,
              something is not necessarily safe or good for you just because it
              is natural. Hemlock, mercury, lead, toadstools, box jellyfish
              toxins, and asbestos are just a few examples of harmful
              substances. There are also many more, like E. coli, salmonella,
              bubonic plague, and smallpox. You should be wary of products that
              say they are healthy because they only use natural ingredients.
            </p>
            <p>
              “All-natural” does not necessarily mean that a product is healthy.
              Think about the illogical claim made by those who say regular
              farmers grow less healthy food. Organic farmers think that
              standard growers are bad, money-hungry businesses that only care
              about making money. What is the best way to make more money? To
              get rid of some chemicals and fertilizer. This means they have to
              use goods that are much more advanced and work better. It’s been
              many decades since the idea that herbicides leave behind harmful
              substances. The process of making food is one of the most
              controlled and closely watched. And the synthetic fertilizers and
              chemicals used today are completely biodegradable. They are backed
              by decades of research that shows they are completely safe.
            </p>
          </div>
        </section>

        {/* Questions 1–5: multiple choice */}
        <section className="space-y-4">
          <h2 className="text-sm md:text-base font-semibold text-[#1f2933]">
            Questions 1–5
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Second text with blanks 6–10 */}
            <section className="space-y-3 text-sm md:text-base pt-4">
              <h2 className="text-sm font-semibold text-[#1f2933]">
                Text with Blanks (Questions 6–10)
              </h2>
              <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-2 text-gray-900">
                <p>
                  It’s fascinating to read about the
                  {renderBlankSelect('BLANK6')}
                  surrounding organic food. This article really highlights the
                  need for evidence-based beliefs. The argument that genes, not
                  the farming method, determine a plant’s
                  {renderBlankSelect('BLANK7')}
                  makes sense. Also, the information about organic pesticides
                  being less effective and
                  {renderBlankSelect('BLANK8')}
                  harmful is eye-opening. It’s a reminder that “natural”
                  doesn’t always equate to safety. The
                  {renderBlankSelect('BLANK9')}
                  on controlled processes and the safety of synthetic
                  fertilizers and chemicals is reassuring. This article
                  challenges common assumptions and encourages a more
                  {renderBlankSelect('BLANK10')}
                  perspective on organic farming.
                </p>
              </div>
              <p className="text-xs md:text-sm text-gray-700">
                Use the dropdowns in the text to choose the best option for each
                blank (6–10).
              </p>
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
                Finish Exam
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
