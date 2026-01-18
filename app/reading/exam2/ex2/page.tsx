'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex2';

const introText =
  'You will read a diagram, schedule, chart, or notice. Answer questions by applying the information to a situation.';

const emailWithBlanks = `
Subject: Art Workshop

Hi Sara,

Thank you so much for the extraordinary present you sent! The handmade art piece you created is truly beautiful and has significantly enhanced the beauty of my living room. Recently, I stumbled upon an email about an art workshop that’s caught my interest. Jack is showing a lot of enthusiasm towards it, and I’d really appreciate your thoughts on this matter. The workshop covers various creative techniques including {{BLANK1}}, alongside diverse methods for {{BLANK2}}.

Given Jack’s rich imagination, I’m considering signing him up for the clay modeling segment of the workshop. This would offer him a chance to learn the art of {{BLANK3}} using clay. My busy schedule makes it more feasible to opt for a full-day program. Conveniently, this option includes {{BLANK4}}, which is a big plus. I’m confident Jack will be thrilled to explore the {{BLANK5}} through this medium. If Alex is also interested, then please let me know. I would be happy to pick and drop both the kids.

Have a great day,
Linda
`;

const blanks = [
  {
    id: 'BLANK1',
    options: [
      { id: 'a', text: 'storytelling' },
      { id: 'b', text: 'calligraphy' },
      { id: 'c', text: 'painting and sculpting with clay' },
      { id: 'd', text: 'sketching' },
    ],
  },
  {
    id: 'BLANK2',
    options: [
      { id: 'a', text: 'three-dimensional designs' },
      { id: 'b', text: 'glazing' },
      { id: 'c', text: 'character development' },
      { id: 'd', text: 'two-dimensional designs' },
    ],
  },
  {
    id: 'BLANK3',
    options: [
      { id: 'a', text: 'draw' },
      { id: 'b', text: 'shaping and detailing figures' },
      { id: 'c', text: 'glaze' },
      { id: 'd', text: 'manipulate' },
    ],
  },
  {
    id: 'BLANK4',
    options: [
      { id: 'a', text: 'playtime' },
      { id: 'b', text: 'acrylic painting' },
      { id: 'c', text: 'story session' },
      { id: 'd', text: 'lunch' },
    ],
  },
  {
    id: 'BLANK5',
    options: [
      { id: 'a', text: 'dimensions' },
      { id: 'b', text: 'unique features of different forms and creatures' },
      { id: 'c', text: 'both a and b' },
      { id: 'd', text: 'none of the above' },
    ],
  },
];

const mcQuestions = [
  {
    id: 'Q6',
    text: 'Jack and Alex are ________.',
    options: [
      { id: 'A', text: 'brothers' },
      { id: 'B', text: 'trainers' },
      { id: 'C', text: 'friends' },
      { id: 'D', text: 'strangers' },
    ],
  },
  {
    id: 'Q7',
    text: 'Classes for drawing, painting, and clay modelling will be ________.',
    options: [
      { id: 'A', text: 'same' },
      { id: 'B', text: 'on different days' },
      { id: 'C', text: 'all day long' },
      { id: 'D', text: 'distinct' },
    ],
  },
  {
    id: 'Q8',
    text: 'At the end of the class, the clay creatures will be ________.',
    options: [
      { id: 'A', text: 'discarded' },
      { id: 'B', text: 'demolded' },
      { id: 'C', text: 'polished and baked' },
      { id: 'D', text: 'investigated' },
    ],
  },
];

export default function ReadingExam2Ex2Page() {
  const router = useRouter();
  const { student, answers, setAnswer } = useReadingExam();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!student) router.replace('/reading/exam2');
  }, [student, router]);

  if (!student) return null;

  const exerciseAnswers = answers[EXERCISE_ID] || {};

  const handleBlankChange = (blankId: string, optionId: string) => {
    setError('');
    setAnswer(EXERCISE_ID, blankId, optionId);
  };

  const handleMcChange = (qid: string, optId: string) => {
    setError('');
    setAnswer(EXERCISE_ID, qid, optId);
  };

  const handleNext = () => {
    const allBlanksAnswered = blanks.every((b) => exerciseAnswers[b.id]);
    const allMcAnswered = mcQuestions.every((q) => exerciseAnswers[q.id]);

    if (!allBlanksAnswered || !allMcAnswered) {
      setError('Please complete all blanks and answer all questions before continuing.');
      return;
    }

    router.push('/reading/exam2/ex3');
  };

  const renderedEmail = emailWithBlanks
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
        <header className="space-y-1">
          <h1 className="text-xl font-bold text-[#d40000]">
            Reading Exam 2 – Part 2: Apply a Diagram
          </h1>
          <p className="text-sm text-gray-900 text-justify">{introText}</p>
          <p className="text-[11px] text-gray-800">
            Student: <span className="font-semibold">{student.studentName}</span> | Teacher:{' '}
            <span className="font-semibold">{student.teacherName}</span>
          </p>
        </header>

        {/* Diagram / flyer section with image */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed space-y-3">
          <h2 className="text-sm font-semibold text-[#d40000] mb-1">
            Art Workshop Flyer
          </h2>
          <p className="text-xs text-gray-800">
            Look carefully at the workshop flyer and then answer the questions below.
          </p>
          <div className="flex justify-center">
            <Image
              src="/image2.jpg"
              alt="Art Workshop Flyer"
              width={600}
              height={600}
              className="w-full max-w-md h-auto rounded-md border border-[#e0d6c7] shadow-sm"
              priority
            />
          </div>
        </section>

        {/* Email with blanks 1–5 */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed text-justify space-y-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Questions 1–5
          </h2>
          <p className="text-xs text-gray-800">
            Complete Linda&apos;s email by choosing the best option for each blank.
          </p>
          <div className="whitespace-pre-line">{renderedEmail}</div>
        </section>

        {/* Questions 6–8 */}
        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Questions 6–8</p>
            <p className="text-xs text-gray-800 text-justify">
              Choose the best option, based on the flyer and the email.
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
                      <span>
                        {opt.id}. {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {error && <p className="text-xs text-red-600">{error}</p>}

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

