'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex4';

const mcQuestions = [
  {
    id: 'Q1',
    question: '1. The health risks of social isolation are similar to those of ________.',
    options: [
      { id: 'A', label: 'A) Chronic stress' },
      { id: 'B', label: 'B) Frequent travel' },
      { id: 'C', label: 'C) Poor diet' },
      { id: 'D', label: 'D) Addictive habits' },
    ],
  },
  {
    id: 'Q2',
    question: '2. One reason people feel lonelier today is ________.',
    options: [
      { id: 'A', label: 'A) Decreasing work hours' },
      { id: 'B', label: 'B) Changing family structures' },
      { id: 'C', label: 'C) Declining internet usage' },
      { id: 'D', label: 'D) Overcrowded cities' },
    ],
  },
  {
    id: 'Q3',
    question: '3. Prolonged isolation can lead to ________.',
    options: [
      { id: 'A', label: 'A) Faster healing rates' },
      { id: 'B', label: 'B) Elevated health risks' },
      { id: 'C', label: 'C) Better emotional resilience' },
      { id: 'D', label: 'D) Increased multitasking ability' },
    ],
  },
  {
    id: 'Q4',
    question: '4. One societal cost of loneliness is ________.',
    options: [
      { id: 'A', label: 'A) Enhanced job satisfaction' },
      { id: 'B', label: 'B) Decline in economic output' },
      { id: 'C', label: 'C) Increase in recreational activities' },
      { id: 'D', label: 'D) Reduced healthcare innovation' },
    ],
  },
  {
    id: 'Q5',
    question: '5. An individual-level approach to reduce isolation is ________.',
    options: [
      { id: 'A', label: 'A) Avoiding social events' },
      { id: 'B', label: 'B) Limiting personal outreach' },
      { id: 'C', label: 'C) Participating in local activities' },
      { id: 'D', label: 'D) Increasing screen time' },
    ],
  },
];

type BlankId = 'BLANK6' | 'BLANK7' | 'BLANK8' | 'BLANK9' | 'BLANK10';

const blankIds: BlankId[] = ['BLANK6', 'BLANK7', 'BLANK8', 'BLANK9', 'BLANK10'];

const completionOptions: Record<
  BlankId,
  { number: number; options: { id: 'a' | 'b' | 'c' | 'd'; label: string }[] }
> = {
  BLANK6: {
    number: 6,
    options: [
      { id: 'a', label: 'is dancing around' },
      { id: 'b', label: 'are beautifully ignored' },
      { id: 'c', label: 'cannot be overstated' },
      { id: 'd', label: 'does jumble apart' },
    ],
  },
  BLANK7: {
    number: 7,
    options: [
      { id: 'a', label: 'construct' },
      { id: 'b', label: 'rival' },
      { id: 'c', label: 'gobble throughout' },
      { id: 'd', label: 'shadow below' },
    ],
  },
  BLANK8: {
    number: 8,
    options: [
      { id: 'a', label: 'The paradox of feeling' },
      { id: 'b', label: 'A bundle of consistent' },
      { id: 'c', label: 'An orchard of missing' },
      { id: 'd', label: 'Too square to touch' },
    ],
  },
  BLANK9: {
    number: 9,
    options: [
      { id: 'a', label: 'swimming across fields' },
      { id: 'b', label: 'public health campaigns' },
      { id: 'c', label: 'feasting downward trends' },
      { id: 'd', label: 'leaping books apart' },
    ],
  },
  BLANK10: {
    number: 10,
    options: [
      { id: 'a', label: 'fostering' },
      { id: 'b', label: 'running far ahead' },
      { id: 'c', label: 'crafting downward slopes' },
      { id: 'd', label: 'evading truth inside' },
    ],
  },
};

export default function ReadingExam4Ex4Page() {
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

    router.push('/reading/exam4/completed');
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
            Reading Exam 4 · Part 4
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Reading for Viewpoints
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            Read the text and answer questions that compare, contrast, and analyze viewpoints.
          </p>
        </header>

        <section className="space-y-3 text-sm md:text-base">
          <h2 className="text-sm font-semibold text-[#1f2933]">Text</h2>
          <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-3 text-gray-900">
            <p>
              Social isolation, once viewed primarily as a personal or social concern, is now recognized as a significant public health issue.
              The lack of meaningful social connections can have profound effects on mental, emotional, and physical well-being, rivaling the
              health risks of smoking, obesity, and chronic diseases.
            </p>
            <p>
              In today’s interconnected world, the paradox of social isolation is particularly striking. Despite advances in communication technology,
              many individuals feel more disconnected than ever. Factors such as increased urbanization, a rise in single-person households, and the
              growing prevalence of remote work have contributed to the erosion of traditional social bonds. While technology has made it easier to connect
              virtually, these interactions often lack the depth and intimacy of face-to-face relationships, exacerbating feelings of loneliness.
            </p>
            <p>
              The health consequences of social isolation are well-documented. Research has shown that prolonged isolation can lead to an increased risk
              of depression, anxiety, and cognitive decline. Physically, it can elevate stress levels, compromise immune function, and contribute to conditions
              such as hypertension and cardiovascular disease. Alarmingly, studies suggest that social isolation can increase the risk of premature death,
              making it as dangerous as well-known health hazards.
            </p>
            <p>
              Social isolation doesn’t just affect individuals; it also places a burden on society. Lonely individuals are more likely to seek medical attention,
              contributing to higher healthcare costs. Furthermore, the lack of social support networks can lead to diminished productivity and engagement in workplaces,
              affecting economic performance.
            </p>
            <p>
              Efforts to address social isolation require a multifaceted approach. Community-based initiatives, such as social clubs, group activities, and outreach programs,
              play a vital role in fostering connection. Public health campaigns can raise awareness about the importance of maintaining social ties, while workplaces and schools
              can create environments that encourage collaboration and inclusion. On an individual level, small acts like reaching out to a friend, volunteering, or joining a local
              group can make a significant difference.
            </p>
            <p>
              Social isolation is not just a personal struggle—it is a public health challenge that demands collective action. By recognizing its far-reaching implications and taking
              proactive steps to foster connection, we can work towards building healthier, more connected communities. Addressing this issue is not only a matter of individual well-being
              but also a step towards a more resilient and compassionate society.
            </p>
          </div>
        </section>

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

            <section className="space-y-3 text-sm md:text-base pt-4">
              <h2 className="text-sm font-semibold text-[#1f2933]">
                Text with Blanks (Questions 6–10)
              </h2>

              <p className="text-xs md:text-sm text-gray-700">
                Use the dropdowns in the text to choose the best option for each blank (6–10).
              </p>
              
              <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-2 text-gray-900">
                <p>
                  The profound impact of meaningful connections on mental, emotional, and physical health
                  {renderBlankSelect('BLANK6')}, making this article an important and timely read. It’s alarming to learn how
                  loneliness can {renderBlankSelect('BLANK7')} smoking and chronic diseases in its health risks, emphasizing the need
                  for greater awareness. {renderBlankSelect('BLANK8')} isolated in an interconnected world is striking and reflects
                  the challenges of modern life. I appreciate the focus on actionable solutions, from community programs to
                  {renderBlankSelect('BLANK9')}, which inspire hope for change. This piece serves as a powerful reminder of the
                  importance of {renderBlankSelect('BLANK10')} genuine human connection in our lives.
                </p>
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
                Finish Exam
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
