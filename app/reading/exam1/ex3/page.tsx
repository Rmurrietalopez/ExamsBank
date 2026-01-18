'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex3';

const introTitle = 'Reading to Apply a Diagram';
const introText =
  'You will read a diagram, schedule, chart, or notice. Answer questions by applying the information to a situation.';

// NOTE: Put your image file in /public as /image1.png or adjust src accordingly.
const diagramSrc = '/image1.png';

const emailTextWithBlanks = `
To: michael.smith@example.com
From: jessica.taylor@samplemail.com

Hi Michael,
I’ve been reflecting on our recent conversation about your upcoming anniversary and how you want to make it truly unforgettable. 1.{{BLANK1}} I stumbled upon is called LuxDrive Rentals, which specializes in luxurious car rentals designed to elevate any special occasion. They offer an impressive range of vehicles, from 2.{{BLANK2}} like Mercedes-Benz and BMW to jaw-dropping sports cars like Ferrari and Lamborghini. What I found particularly appealing is their commitment to providing {{BLANK3}}, including complimentary insurance and roadside assistance, which can alleviate any potential worries on your special day. Their current offers, such as a weekend special where you can enjoy a 50% discount 4.{{BLANK4}} when you rent for three days, might suit your plans perfectly. Additionally, they have an enticing event package that includes a complimentary chauffeur for four hours—perfect for 5.{{BLANK5}}. Their flexible hours, open seven days a week, would surely accommodate your schedule. Just thought I’d share this idea since I know how much you value unforgettable experiences. Let me know if you’d like to explore this further!
Best,
Jessica
`;

const blanks = [
  {
    id: 'BLANK1',
    labelNumber: 1,
    options: [
      { id: 'A', text: 'A mundane choice' },
      { id: 'B', text: 'An intriguing option' },
      { id: 'C', text: 'A boring suggestion' },
      { id: 'D', text: 'A confusing idea' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'BLANK2',
    labelNumber: 2,
    options: [
      { id: 'A', text: 'luxury trucks' },
      { id: 'B', text: 'elegant sedans' },
      { id: 'C', text: 'elegant sedans (repeated in the grid, typo original)' },
      { id: 'D', text: 'basic motorcycles' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'BLANK3',
    labelNumber: 3,
    options: [
      { id: 'A', text: 'a seamless experience' },
      { id: 'B', text: 'an unnecessary burden' },
      { id: 'C', text: 'limited options' },
      { id: 'D', text: 'complicated procedures' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 'BLANK4',
    labelNumber: 4,
    options: [
      { id: 'A', text: 'on the first day' },
      { id: 'B', text: 'at any time' },
      { id: 'C', text: 'on the fourth day' },
      { id: 'D', text: 'for every day' },
    ],
    correctOptionId: 'D',
  },
  {
    id: 'BLANK5',
    labelNumber: 5,
    options: [
      { id: 'A', text: 'staying at home' },
      { id: 'B', text: 'rushing to events' },
      { id: 'C', text: 'avoiding the spotlight' },
      { id: 'D', text: 'making a grand entrance' },
    ],
    correctOptionId: 'D',
  },
];

const mcQuestions = [
  {
    id: 'Q6',
    text:
      'The fact that Jessica reaches out with a suggestion demonstrates that she is…',
    options: [
      { id: 'A', text: 'Indifferent to Michael’s plans' },
      { id: 'B', text: 'Supportive and attentive to his needs' },
      { id: 'C', text: 'Attempting to sell him something' },
      { id: 'D', text: 'Unsure about what he wants' },
    ],
    correctOptionId: 'B',
  },
  {
    id: 'Q7',
    text: 'Jessica’s tone in the email can best be described as…',
    options: [
      { id: 'A', text: 'Dismissive and uninterested' },
      { id: 'B', text: 'Uncertain and skeptical' },
      { id: 'C', text: 'Encouraging and enthusiastic' },
      { id: 'D', text: 'Formal and detached' },
    ],
    correctOptionId: 'C',
  },
  {
    id: 'Q8',
    text:
      'What does Jessica likely hope Michael will do after reading her email?',
    options: [
      { id: 'A', text: 'Ignore the suggestion entirely' },
      { id: 'B', text: 'Be overwhelmed by too many options' },
      { id: 'C', text: 'Consider LuxDrive Rentals for his special occasion' },
      { id: 'D', text: 'Decide against having any celebration' },
    ],
    correctOptionId: 'C',
  },
];

export default function ReadingExam1Exercise3Page() {
  const router = useRouter();
  const { student, answers, setAnswer } = useReadingExam();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!student) router.replace('/reading/exam1');
  }, [student, router]);

  if (!student) return null;

  const exerciseAnswers = answers[EXERCISE_ID] || {};

  const handleBlankChange = (blankId: string, optionId: string) => {
    setError('');
    setAnswer(EXERCISE_ID, blankId, optionId);
  };

  const handleMcChange = (questionId: string, optionId: string) => {
    setError('');
    setAnswer(EXERCISE_ID, questionId, optionId);
  };

  const handleNext = () => {
    const allBlanksAnswered = blanks.every((b) => exerciseAnswers[b.id]);
    const allMcAnswered = mcQuestions.every((q) => exerciseAnswers[q.id]);
    if (!allBlanksAnswered || !allMcAnswered) {
      setError('Please complete all parts before continuing.');
      return;
    }
    router.push('/reading/exam1/ex4');
  };

  const renderedEmail = emailTextWithBlanks
    .split(/(\{\{.*?\}\})/g)
    .map((part, index) => {
      const match = part.match(/\{\{(.*?)\}\}/);
      if (!match) return <span key={index}>{part}</span>;

      const blankId = match[1].trim();
      const blank = blanks.find((b) => b.id === blankId);
      const selected = exerciseAnswers[blankId] || '';
      if (!blank) return <span key={index}>[?]</span>;

      return (
        <select
          key={index}
          className="mx-1 border border-[#c4baad] bg-white text-gray-900 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#d40000]"
          value={selected}
          onChange={(e) => handleBlankChange(blankId, e.target.value)}
        >
          <option value="" disabled>
            — Select —
          </option>
          {blank.options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.text}
            </option>
          ))}
        </select>
      );
    });

  return (
    <main className="min-h-screen bg-[#f2eddb]">
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-xl font-bold text-[#d40000]">
            Reading Exam 1 - Exercise 2
          </h1>
          <p className="text-sm text-gray-900 text-justify">{introText}</p>
          <p className="text-[11px] text-gray-800">
            Student:{' '}
            <span className="font-semibold">{student.studentName}</span> | Teacher:{' '}
            <span className="font-semibold">{student.teacherName}</span>
          </p>
        </header>

        {/* Diagram / Image */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-4 flex flex-col items-center gap-3">
          <p className="text-xs text-gray-800 text-justify">
            Refer to the information in the diagram/advertisement below.
          </p>
          <img
            src={diagramSrc}
            alt="LuxDrive Rentals promotional diagram"
            className="w-full max-w-2xl h-auto object-contain border border-[#e0d6c7] rounded-md bg-white shadow-sm"
          />
        </section>

        {/* Email with dropdown blanks */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed text-justify whitespace-pre-line space-y-2">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">
            Email:
          </h2>
          <div>{renderedEmail}</div>
        </section>

        {/* Multiple-choice questions */}
        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Correspondence (Questions 6–8)
            </p>
            <p className="text-xs text-gray-800 text-justify">
              Choose the best option according to the information in the email and the diagram.
            </p>
          </div>

          {mcQuestions.map((q) => {
            const selected = exerciseAnswers[q.id] || '';
            return (
              <div
                key={q.id}
                className="bg-[#fffcf9] border border-[#e0d6c7] rounded-lg p-4 space-y-3"
              >
                <p className="text-sm font-semibold text-gray-900 leading-snug text-justify">
                  {q.id}. {q.text}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 text-sm text-gray-900 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.id}
                        checked={selected === opt.id}
                        onChange={() => handleMcChange(q.id, opt.id)}
                        className="h-4 w-4 accent-[#d40000]"
                      />
                      <span className="leading-snug">{opt.id}. {opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}

        {/* Next button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-[#d40000] text-white rounded-md text-sm font-semibold hover:bg-[#ba0000] transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  );
}

