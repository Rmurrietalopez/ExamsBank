'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex1';

const introText =
  'You will read a short exchange of emails or messages. Answer questions about content, tone, and purpose.';

const messageText = `
Dear David,

I trust this email finds you in the best of spirits and thoroughly enjoying your well-earned summer break. The determination and effort you put into your Class XII board exams were truly commendable, and it’s great to know that you’re now unwinding, perhaps spending some quality time playing cricket with your friends. I must say, my visit to your home last week was delightful, and the culinary skills of your mother left an indelible impression on me; I’ve been praising her dishes to my family ever since!

During my visit, we had a chance to discuss your future aspirations, especially now that your board exams are behind you. Just yesterday, I stumbled upon an article in a magazine that struck me as something that could guide you in your decision-making process. Given your enthusiasm for exploring new cultures, engaging with diverse groups of people, and your innate curiosity about the world, a career in international relations seems like an excellent fit for you.

Your extensive travels have already given you a rich understanding of various cultures and social dynamics, an essential asset in this field. You possess a natural flair for communication and a genuine interest in global affairs, both critical in international relations. To further cultivate these skills, you might consider pursuing a degree in International Studies or Political Science. Additionally, internships with NGOs, embassies, or international organizations could provide practical experience and valuable insights into this career path.

Should you choose this direction, you could find opportunities in diplomacy, global policy-making, or even with international NGOs. The possibilities are vast, and I believe your unique talents and experiences would make you a standout in this arena. Wishing you all the best as you contemplate a path that’s as extraordinary as you are.

Warm regards,
Your devoted friend,
Glen Nelson
`;

const mcQuestions = [
  {
    id: 'Q1',
    text:
      'A profession in the travel industry is perfectly suited for David, given ________.',
    options: [
      { id: 'A', text: 'his passion for exploring the world' },
      { id: 'B', text: 'his travel agency ownership' },
      { id: 'C', text: 'his decision not to pursue further studies' },
      { id: 'D', text: 'his desire to travel few places' },
    ],
  },
  {
    id: 'Q2',
    text: 'David and Glen Nelson ________.',
    options: [
      { id: 'A', text: 'not seen each other for a long time' },
      { id: 'B', text: 'have recently met' },
      { id: 'C', text: 'joined the same course' },
      { id: 'D', text: 'just appeared for their XII board exam' },
    ],
  },
  {
    id: 'Q3',
    text:
      'Completing a certified course in Travel and Tourism will enable David to ________.',
    options: [
      { id: 'A', text: 'meet new people' },
      { id: 'B', text: 'visit new places' },
      { id: 'C', text: 'hone his qualities' },
      { id: 'D', text: 'establish his own holiday company' },
    ],
  },
  {
    id: 'Q4',
    text:
      'To enroll in any diploma or certificate course, it is mandatory for a candidate to have ________.',
    options: [
      { id: 'A', text: 'extensive knowledge about people' },
      { id: 'B', text: 'successfully passed their class XII board examinations' },
      { id: 'C', text: 'passion for cooking' },
      { id: 'D', text: 'strong communication skills' },
    ],
  },
  {
    id: 'Q5',
    text:
      'Glen Nelson is optimistic about David’s prospects in the tourism industry because ________.',
    options: [
      { id: 'A', text: 'he is a travel enthusiast' },
      { id: 'B', text: 'he owns a travel agency' },
      { id: 'C', text: 'he is an extrovert' },
      { id: 'D', text: 'both a and c' },
    ],
  },
  {
    id: 'Q6',
    text: 'Glen Nelson takes pleasure in ________.',
    options: [
      { id: 'A', text: 'reading magazine' },
      { id: 'B', text: 'savoring fine cuisine' },
      { id: 'C', text: 'travelling to new places' },
      { id: 'D', text: 'giving advice' },
    ],
  },
];

const replyWithBlanks = `
Dear Glen Nelson,

It was such a delight spending time with you! Everyone here misses you dearly. Your observation skills are truly impressive. I was contemplating something similar, and your letter helped clear my thoughts. I’ve decided to sign up for {{BLANK7}}. After researching various colleges, I fortunately found one close to where you are. This means I’ll get the opportunity to {{BLANK8}}. Even my mom is thrilled about this; she’s already started preparing {{BLANK9}} for you. Once I complete my course, my ambition is to start my own travel business, and I’d be honored to have you join me as a {{BLANK10}}. Your advice has been invaluable in helping me choose the right {{BLANK11}}.

Looking forward to seeing you soon,
David
`;

const blanks = [
  {
    id: 'BLANK7',
    options: [
      { id: 'a', text: 'government job' },
      { id: 'b', text: 'cricket academy' },
      { id: 'c', text: 'travel and tourism course' },
      { id: 'd', text: 'cookery classes' },
    ],
  },
  {
    id: 'BLANK8',
    options: [
      { id: 'a', text: 'meet Nelson frequently' },
      { id: 'b', text: 'visit some travel agencies' },
      { id: 'c', text: 'discover new places' },
      { id: 'd', text: 'study harder' },
    ],
  },
  {
    id: 'BLANK9',
    options: [
      { id: 'a', text: 'knitwear' },
      { id: 'b', text: 'travel kits' },
      { id: 'c', text: 'gift cards' },
      { id: 'd', text: 'goodies' },
    ],
  },
  {
    id: 'BLANK10',
    options: [
      { id: 'a', text: 'excellent cook' },
      { id: 'b', text: 'voracious reader' },
      { id: 'c', text: 'marketing expert' },
      { id: 'd', text: 'advertising professional' },
    ],
  },
  {
    id: 'BLANK11',
    options: [
      { id: 'a', text: 'recipe' },
      { id: 'b', text: 'travel plan' },
      { id: 'c', text: 'career' },
      { id: 'd', text: 'place' },
    ],
  },
];

export default function ReadingExam2Ex1Page() {
  const router = useRouter();
  const { student, answers, setAnswer } = useReadingExam();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!student) router.replace('/reading/exam2');
  }, [student, router]);

  if (!student) return null;

  const exerciseAnswers = answers[EXERCISE_ID] || {};

  const handleMcChange = (questionId: string, optionId: string) => {
    setError('');
    setAnswer(EXERCISE_ID, questionId, optionId);
  };

  const handleBlankChange = (blankId: string, optionId: string) => {
    setError('');
    setAnswer(EXERCISE_ID, blankId, optionId);
  };

  const handleNext = () => {
    const allMcAnswered = mcQuestions.every((q) => exerciseAnswers[q.id]);
    const allBlanksAnswered = blanks.every((b) => exerciseAnswers[b.id]);

    if (!allMcAnswered || !allBlanksAnswered) {
      setError('Please answer all questions and complete all blanks before continuing.');
      return;
    }

    router.push('/reading/exam2/ex2');
  };

  const renderedReply = replyWithBlanks
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
            Reading Exam 2 – Part 1: Correspondence
          </h1>
          <p className="text-sm text-gray-900 text-justify">{introText}</p>
          <p className="text-[11px] text-gray-800">
            Student: <span className="font-semibold">{student.studentName}</span> | Teacher:{' '}
            <span className="font-semibold">{student.teacherName}</span>
          </p>
        </header>

        {/* Original message */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed text-justify whitespace-pre-line space-y-3">
          <h2 className="text-sm font-semibold text-[#d40000] mb-1">
            Message
          </h2>
          <p>{messageText}</p>
        </section>

        {/* Q1–6 MC */}
        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Questions 1–6</p>
            <p className="text-xs text-gray-800 text-justify">
              Choose the best option according to the message.
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
                        {opt.id.toUpperCase()}. {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Reply with blanks 7–11 */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed text-justify space-y-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Questions 7–11
          </h2>
          <p className="text-xs text-gray-800">
            Complete David&apos;s reply by choosing the best option for each blank.
          </p>
          <div>{renderedReply}</div>
        </section>

        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}

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
