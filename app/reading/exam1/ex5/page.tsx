'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex5';

const introTitle = 'Reading for Viewpoints';
const introText =
  'You will read a text that presents different opinions or arguments. Answer questions that compare, contrast, and analyze viewpoints.';

const articleText = `
In an age dominated by digital entertainment, the resurgence of board games might seem unexpected. Yet, over the past few years, there has been a remarkable revival of interest in analog gaming. This renaissance can be attributed to various factors that highlight the unique appeal of board games, making them a staple for family gatherings, friend meetups, and even competitive events.

One of the primary reasons for this resurgence is the growing desire for social interaction. In a world where digital communication often replaces face-to-face encounters, board games offer a tangible way to connect. Sitting around a table encourages conversation and collaboration, allowing players to engage in shared experiences that foster camaraderie. This is particularly appealing for younger generations, who seek meaningful interactions in a fast-paced, technology-driven society.

Moreover, the board game industry has evolved significantly over the past decade. The variety of games available now caters to a wide range of interests and age groups. From complex strategy games like "Terraforming Mars" to familiar titles like "Catan," there is something for everyone. This diversity has attracted a new audience, including casual gamers and those who may have previously dismissed board games as outdated. Additionally, many modern board games incorporate innovative mechanics and themes that reflect contemporary culture, making them more relevant and engaging.

The tactile experience of playing a board game also contributes to its appeal. Unlike video games, which rely on screens and controllers, board games offer a sensory experience. The feel of the pieces, the sound of dice rolling, and the visual layout of the game board create an immersive atmosphere. This physicality can be a refreshing break from the digital world, allowing players to disconnect and enjoy the present moment.

Finally, the rise of board game cafes and community events has helped create a supportive environment for enthusiasts. These spaces foster a sense of belonging, encouraging people to discover new games and meet like-minded individuals. The accessibility of games through these venues has also sparked interest among those who might not have previously considered board gaming.

So, the renaissance of board games reflects a growing appreciation for social interaction, creativity, and the joy of physical play. As people recognize the benefits of analog gaming, it is clear that board games are not just a nostalgic relic but a vibrant part of modern culture.
`;

// Part 1: Q1–5
const mcQuestions = [
  {
    id: 'Q1',
    text: 'The resurgence of board games can best be seen as a reaction to…',
    options: [
      { id: 'A', text: 'the popularity of video games' },
      { id: 'B', text: 'the desire for meaningful connections' },
      { id: 'C', text: 'the evolution of technology' },
      { id: 'D', text: 'the decline of family gatherings' },
    ],
  },
  {
    id: 'Q2',
    text: 'The phrase “tangible way to connect” suggests that board games…',
    options: [
      { id: 'A', text: 'are more expensive than digital games' },
      { id: 'B', text: 'provide a virtual experience' },
      { id: 'C', text: 'facilitate physical interaction' },
      { id: 'D', text: 'are only for competitive play' },
    ],
  },
  {
    id: 'Q3',
    text: 'The evolution of the board game industry is characterized by…',
    options: [
      { id: 'A', text: 'a reduction in the number of games available' },
      { id: 'B', text: 'an increase in accessibility and variety' },
      { id: 'C', text: 'a focus solely on complex strategy games' },
      { id: 'D', text: 'a decline in interest from casual gamers' },
    ],
  },
  {
    id: 'Q4',
    text:
      'Board games are described as offering a sensory experience. This implies that they…',
    options: [
      { id: 'A', text: 'are not suitable for children' },
      { id: 'B', text: 'lack depth in gameplay' },
      { id: 'C', text: 'engage players through multiple senses' },
      { id: 'D', text: 'are limited to traditional gameplay' },
    ],
  },
  {
    id: 'Q5',
    text: 'The rise of board game cafes signifies…',
    options: [
      { id: 'A', text: 'the end of traditional gaming methods' },
      { id: 'B', text: 'a shift towards individual play' },
      { id: 'C', text: 'a decline in family gatherings' },
      { id: 'D', text: 'the growth of community and social interactions' },
    ],
  },
];

// Part 2: Q6–10 dropdown text
const commentTextWithBlanks = `
It’s refreshing to see the revival of board games in today’s digital age. The {{BLANK6}} on social interaction really resonates with me; it’s so easy to get lost in screens and forget the joy of {{BLANK7}}. I love how the article {{BLANK8}} in the board game market—there’s something out there for everyone, which is so inviting for newcomers. Plus, the {{BLANK9}} of rolling dice and moving pieces can’t be beaten! I’m excited to explore local board game cafes and connect with fellow enthusiasts. This {{BLANK10}} feels like a wonderful opportunity to build community.
`;

const blanks = [
  {
    id: 'BLANK6',
    options: [
      { id: 'A', text: 'emphasis' },
      { id: 'B', text: 'Exaggeration' },
      { id: 'C', text: 'Apprehension' },
      { id: 'D', text: 'Selection' },
    ],
  },
  {
    id: 'BLANK7',
    options: [
      { id: 'A', text: 'Group interaction' },
      { id: 'B', text: 'Team disengagement' },
      { id: 'C', text: 'Computer talk' },
      { id: 'D', text: 'face-to-face engagement' },
    ],
  },
  {
    id: 'BLANK8',
    options: [
      { id: 'A', text: 'Avoids discussing the sameness' },
      { id: 'B', text: 'Enforces the banality' },
      { id: 'C', text: 'highlights the diversity' },
      { id: 'D', text: 'Abolishes the options' },
    ],
  },
  {
    id: 'BLANK9',
    options: [
      { id: 'A', text: 'Textual impression' },
      { id: 'B', text: 'tactile experience' },
      { id: 'C', text: 'Handled process' },
      { id: 'D', text: 'Emotional feeling' },
    ],
  },
  {
    id: 'BLANK10',
    options: [
      { id: 'A', text: 'Fall' },
      { id: 'B', text: 'Dwindling' },
      { id: 'C', text: 'resurgence' },
      { id: 'D', text: 'Decline' },
    ],
  },
];

export default function ReadingExam1Exercise5Page() {
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
      setError('Please answer all questions and complete all blanks before finishing.');
      return;
    }

    router.push('/reading/exam/completed');
  };

  const renderedComment = commentTextWithBlanks
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
            Reading Exam 1 – Exercise 5
          </h1>
          <p className="text-sm text-gray-900 text-justify">
            {introText}
          </p>
          <p className="text-[11px] text-gray-800">
            Student:{' '}
            <span className="font-semibold">{student.studentName}</span> | Teacher:{' '}
            <span className="font-semibold">{student.teacherName}</span>
          </p>
        </header>

        {/* Article */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed text-justify whitespace-pre-line space-y-3">
          <h2 className="text-sm font-semibold text-[#d40000] mb-1">
            Text
          </h2>
          <p>{articleText}</p>
        </section>

        {/* Questions 1–5: MC */}
        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Questions 1–5
            </p>
            <p className="text-xs text-gray-800 text-justify">
              Choose the best option according to the text.
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
                      <span>{opt.id}. {opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Questions 6–10: dropdowns */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed text-justify space-y-2">
          <h2 className="text-sm font-semibold text-gray-900">
            Questions 6–10
          </h2>
          <p className="text-xs text-gray-800">
            Complete the text by choosing the best option for each blank.
          </p>
          <div>{renderedComment}</div>
        </section>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}

        {/* Finish button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-[#d40000] text-white rounded-md text-sm font-semibold hover:bg-[#ba0000] transition-colors"
          >
            Finish →
          </button>
        </div>
      </div>
    </main>
  );
}
