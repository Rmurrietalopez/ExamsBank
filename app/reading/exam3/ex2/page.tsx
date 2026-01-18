'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex2';

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
      { id: 'a', label: 'stress drugs' },
      { id: 'b', label: 'sickness pills' },
      { id: 'c', label: 'recreational drugs' },
      { id: 'd', label: 'pain medication' },
    ],
  },
  BLANK2: {
    number: 2,
    options: [
      { id: 'a', label: 'by itself' },
      { id: 'b', label: 'with other' },
      { id: 'c', label: 'all in one shot' },
      { id: 'd', label: 'with food' },
    ],
  },
  BLANK3: {
    number: 3,
    options: [
      { id: 'a', label: 'must relax' },
      { id: 'b', label: 'take these concerns' },
      { id: 'c', label: 'have to walk' },
      { id: 'd', label: 'are going to sleep' },
    ],
  },
  BLANK4: {
    number: 4,
    options: [
      { id: 'a', label: 'prescription' },
      { id: 'b', label: 'taken' },
      { id: 'c', label: 'dosage' },
      { id: 'd', label: 'pills' },
    ],
  },
  BLANK5: {
    number: 5,
    options: [
      { id: 'a', label: 'throughout the day' },
      { id: 'b', label: 'every four hours' },
      { id: 'c', label: 'half of the day' },
      { id: 'd', label: 'in 8 hour periods' },
    ],
  },
};

const mcQuestions = [
  {
    id: 'Q6',
    question: '6. Amanda ________.',
    options: [
      { id: 'A', label: 'A) has stopped taking some medication' },
      { id: 'B', label: 'B) hasn’t been at the pharmacy recently' },
      { id: 'C', label: 'C) is concerned about her pharmacist' },
      { id: 'D', label: 'D) is not fully aware of her medication' },
    ],
  },
  {
    id: 'Q7',
    question: '7. Amanda’s medication ________.',
    options: [
      { id: 'A', label: 'A) shouldn’t be digested with food' },
      { id: 'B', label: 'B) should be taken solely' },
      { id: 'C', label: 'C) must be consumed within 24 hours' },
      { id: 'D', label: 'D) cannot be taken with children’s medication' },
    ],
  },
  {
    id: 'Q8',
    question: '8. Dorothy ________.',
    options: [
      { id: 'A', label: 'A) considers her knowledge minimal' },
      { id: 'B', label: 'B) her prescribed this medication to Amanda' },
      { id: 'C', label: 'C) offers her expert advice willingly' },
      { id: 'D', label: 'D) refers Amanda to another specialist for advice' },
    ],
  },
];

export default function ReadingExam3Ex2Page() {
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

    router.push('/reading/exam3/ex3');
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
      <div className="w-full max-w-4xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-10 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
            Reading Exam 3 · Part 2
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Reading to Apply a Diagram
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            You will read a diagram and a message from a pharmacist. Answer the
            questions by applying the information correctly.
          </p>
        </header>

        {/* Diagram / image */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-[#1f2933]">
            Medication Information Diagram
          </h2>
          <div className="flex justify-center">
            <Image
              src="/imageExam3.png"
              alt="Medication information diagram"
              width={600}
              height={600}
              className="w-full max-w-md h-auto rounded-md border border-[#e0d6c7] shadow-sm"
              priority
            />
          </div>
        </section>

        {/* Message with inline blanks */}
        <section className="space-y-3 text-sm md:text-base">
          <h2 className="text-sm font-semibold text-[#1f2933]">Message</h2>
          <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-2 text-gray-900">
            <p>Dear Amanda,</p>
            <p>
              I hope this message finds you well. I’m Dorothy from the Shoppers
              Drug Mart pharmacy, and I wanted to provide you with important
              information about the
              {renderBlankSelect('BLANK1')}
              you recently picked up from our store.
            </p>
            <p>
              First and foremost, we want to ensure that you have all the
              necessary information for a safe and effective medication
              experience. When it comes to potential interactions, our primary
              concern was whether you could take this medication
              {renderBlankSelect('BLANK2')}
              prescription drugs you might be on. However, it’s crucial to
              consult with me before combining any medications.
            </p>
            <p>
              I’ve noticed that you had concerns about its impact on your liver
              or kidneys in relation to any other health conditions you might
              have. Rest assured, we
              {renderBlankSelect('BLANK3')}
              seriously, and it’s advisable to monitor your liver and kidney
              function while taking this medication. If you have any specific
              questions or worries in this regard, don’t hesitate to reach out
              to us.
            </p>
            <p>
              Lastly, let’s talk about the recommended
              {renderBlankSelect('BLANK4')}. The standard dosage is two tablets
              every 4 to 6 hours. However, it’s important not to exceed a total
              of 8 tablets in a 24-hour period, even if you’re taking them
              {renderBlankSelect('BLANK5')}. In most cases, it’s wise to start
              with just one tablet and increase the dosage only if your pain is
              severe and unbearable.
            </p>
            <p>
              I trust that this information will be valuable to you, but please
              remember that our pharmacy team is here to provide support and
              answer any questions you may have. Feel free to contact us at any
              time; your well-being is our top priority.
            </p>
            <p>Kind Regards,</p>
            <p>Dorothy Moses</p>
          </div>

          <p className="text-xs md:text-sm text-gray-700">
            Use the dropdowns in the message (1–5) to choose the best option for
            each blank.
          </p>
        </section>

        {/* Questions 6–8: multiple choice */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-sm md:text-base font-semibold text-[#1f2933]">
              Questions 6–8
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
              Next: Part 3
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
