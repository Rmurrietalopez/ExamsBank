'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex1';

const passageTitle = 'Reading Correspondence';
const passageIntro =
  'You will read a short exchange of emails or messages. Answer questions about content, tone, and purpose.';

const emilyMessage = `Message:

Dear Liam,
I am excited to share an opportunity for us to give back to our community through the Clean Green Initiative, hosted by our organization, EcoAction. This event focuses on environmental conservation, specifically a community-wide clean-up and restoration project aimed at revitalizing our local parks and waterways. It’s scheduled for Saturday, October 14th, and your participation would mean so much.

The event will take place at Lakeside Park from 9:00 AM to 3:00 PM. We will be organizing teams to tackle various activities, including litter collection, tree planting, and habitat restoration. We’ll also work on removing invasive species to help local flora and fauna thrive. Whether you have experience in environmental work or are new to volunteering, your efforts will make a significant difference in improving the health of our community’s natural spaces.

I understand how busy life can be, but this is a wonderful opportunity to contribute to a cause that’s close to my heart while connecting with like-minded individuals passionate about environmental stewardship. The event promises to be productive and enjoyable, offering plenty of chances to learn and grow alongside others who care deeply about making a positive impact.

We are expecting a fantastic turnout, with people from all walks of life coming together to contribute their time and energy. Whether you can join us for the entire day or just for a few hours, your presence would be invaluable. All necessary tools and materials will be provided, including gloves, trash bags, and water. Just bring a can-do attitude and your willingness to help!

We have a few special surprises planned for our volunteers, including a picnic lunch at noon featuring locally sourced food and beverages, plus a workshop on sustainable living habits led by an environmental expert. We’ll wrap up the day with a group photo to commemorate our collective efforts.

If you’re interested in joining us, please RSVP by Monday, October 9th, so we can ensure we have enough supplies and food. Feel free to reach out to me directly with any questions or for more details. Your support would mean the world, and I’m confident you’ll find this experience incredibly rewarding.

Thank you for considering this invitation. I look forward to hearing from you soon and hopefully working alongside you on October 14th to make our community a cleaner, greener place for everyone.

Best regards,
Emily
`;

const mcQuestions = [
  {
    id: 'Q1',
    text: 'Emily’s invitation suggests that participation in the event will likely lead to…',
    options: [
      { id: 'A', text: 'a sense of isolation' },
      { id: 'B', text: 'mundane tasks throughout the day' },
      { id: 'C', text: 'indifferent and detached' },
      { id: 'D', text: 'an engaging and rewarding experience' },
    ],
  },
  {
    id: 'Q2',
    text:
      'The mention of “special surprises” implies that volunteers can expect…',
    options: [
      { id: 'A', text: 'frustration with others' },
      { id: 'B', text: 'predictable activities without variation' },
      { id: 'C', text: 'enthusiastic and inviting' },
      { id: 'D', text: 'enjoyable additions beyond the regular activities' },
    ],
  },
  {
    id: 'Q3',
    text: 'Emily’s tone throughout the message can best be described as…',
    options: [
      { id: 'A', text: 'excessive demands on time' },
      { id: 'B', text: 'formal and impersonal' },
      { id: 'C', text: 'critical and demanding' },
      { id: 'D', text: 'enthusiastic and inviting' },
    ],
  },
  {
    id: 'Q4',
    text:
      'By stating, “Just bring a can-do attitude and your willingness to help,” Emily implies that…',
    options: [
      {
        id: 'A',
        text: 'physical ability is the only requirement for participation',
      },
      {
        id: 'B',
        text: 'prior experience in environmental work is necessary',
      },
      {
        id: 'C',
        text: 'a positive mindset is crucial for contributing effectively',
      },
      {
        id: 'D',
        text: 'financial contributions are more valuable than volunteering time',
      },
    ],
  },
  {
    id: 'Q5',
    text: 'The planned picnic lunch likely serves to…',
    options: [
      { id: 'A', text: 'enhance camaraderie and enjoyment' },
      { id: 'B', text: 'provide sustenance without enjoyment' },
      { id: 'C', text: 'discourage interaction among volunteers' },
      { id: 'D', text: 'increase the event’s formality' },
    ],
  },
  {
    id: 'Q6',
    text:
      'The description of the activities indicates that they are aimed at…',
    options: [
      { id: 'A', text: 'solely beautifying the park' },
      { id: 'B', text: 'addressing complex environmental issues' },
      { id: 'C', text: 'fostering competition among volunteers' },
      { id: 'D', text: 'achieving quick results with minimal effort' },
    ],
  },
];

// Liam reply with blanks 7–11
const liamReplyWithBlanks = `
Dear Emily,

Thank you for the invitation to participate in the Clean Green Initiative on October 14th at Lakeside Park. I {{BLANK7}} excited about the opportunity to contribute to environmental conservation and connect with others who {{BLANK8}}. The planned activities, including litter collection, tree planting, and habitat restoration, sound rewarding, and I appreciate {{BLANK9}} volunteers from various backgrounds. I’m particularly looking forward to the picnic lunch and the workshop {{BLANK10}}, which will be a fantastic addition to the day. I will certainly do my best to join {{BLANK11}}, and I will RSVP by October 9th. Thank you again for this meaningful opportunity; I can’t wait to be a part of it!

Best,
Liam
`;

const blanks = [
  {
    id: 'BLANK7',
    options: [
      { id: 'A', text: 'was' },
      { id: 'B', text: 'will be' },
      { id: 'C', text: 'am not' },
      { id: 'D', text: 'am genuinely' },
    ],
  },
  {
    id: 'BLANK8',
    options: [
      { id: 'A', text: 'avoid responsibility' },
      { id: 'B', text: 'share this passion' },
      { id: 'C', text: 'are uninterested' },
      { id: 'D', text: 'disagree with this' },
    ],
  },
  {
    id: 'BLANK9',
    options: [
      { id: 'A', text: 'the neglect of' },
      { id: 'B', text: 'the effort to engage' },
      { id: 'C', text: 'the distraction from' },
      { id: 'D', text: 'the lack of' },
    ],
  },
  {
    id: 'BLANK10',
    options: [
      { id: 'A', text: 'about the weather' },
      { id: 'B', text: 'in traditional cooking' },
      { id: 'C', text: 'on sustainable living' },
      { id: 'D', text: 'of social media' },
    ],
  },
  {
    id: 'BLANK11',
    options: [
      { id: 'A', text: 'after lunch' },
      { id: 'B', text: 'for the full event' },
      { id: 'C', text: 'before the meeting' },
      { id: 'D', text: 'at the picnic' },
    ],
  },
];

export default function ReadingExam1Exercise1Page() {
  const router = useRouter();
  const { student, answers, setAnswer } = useReadingExam();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!student) router.replace('/reading/exam1');
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

    router.push('/reading/exam1/ex3'); // Now jump directly to the diagram exercise
  };

  // Render Liam's reply with dropdowns
  const renderedLiamReply = liamReplyWithBlanks
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
            Reading Exam 1 - Exercise 1
          </h1>
          <p className="text-sm text-gray-900 text-justify">{passageIntro}</p>
          <p className="text-[11px] text-gray-800">
            Student:{' '}
            <span className="font-semibold">{student.studentName}</span> | Teacher:{' '}
            <span className="font-semibold">{student.teacherName}</span>
          </p>
        </header>

        {/* Emily's message */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-4 space-y-2">
          <h2 className="text-sm font-semibold text-gray-900">
            {passageTitle}
          </h2>
          <p className="text-xs text-gray-800 italic">
            Read the message below and answer the questions.
          </p>
          <p className="text-sm text-gray-900 whitespace-pre-line leading-relaxed text-justify">
            {emilyMessage}
          </p>
        </section>

        {/* Questions 1–6 */}
        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Questions (1–6)
            </p>
            <p className="text-xs text-gray-800 text-justify">
              Choose the best option according to the information given in the message.
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
                      <span className="leading-snug">
                        <span className="font-semibold mr-1">
                          {opt.id}.
                        </span>
                        {opt.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Liam's reply with blanks 7–11 */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed text-justify whitespace-pre-line space-y-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Questions (7–11)
          </h2>
          <p className="text-xs text-gray-800">
            Complete Liam’s reply by choosing the best option for each blank.
          </p>
          <div>{renderedLiamReply}</div>
        </section>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}

        {/* Next */}
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

