'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex3';

const introText =
  'You will read a longer informational text. Answer questions about facts, details, organization, and meaning.';

const text = `
Paragraph A
Warthogs are fascinating creatures native to the grasslands, savannas, and woodlands of sub-Saharan Africa. Known scientifically as Phacochoerus africanus, these wild members of the pig family are recognizable by their distinctive tusks and wart-like growths on their faces, which are actually protective bumps. Warthogs are not built for speed but they are adept at digging with their powerful snouts and sharp tusks. They primarily feed on grass, roots, and berries, but occasionally they will consume small animals or carrion. Their diet changes seasonally, depending on the availability of food sources.

Paragraph B
One of the most intriguing aspects of warthogs is their social behavior. They are typically seen in family groups called sounders, which are made up of females and their young. Male warthogs are more solitary but may join these groups during the mating season. Communication among warthogs is varied, including grunts, growls, snorts, and squeals, each serving different purposes in their social interactions. This social structure plays a crucial role in their survival, providing safety in numbers and assistance in caring for the young.

Paragraph C
Adaptation to their environment is a key survival trait for warthogs. They have developed long, padded knees which allow them to kneel while eating grass. This unique posture is rarely seen in other animals. Warthogs also use abandoned burrows of aardvarks or other animals as shelters. These burrows provide protection from predators and extreme weather. In a unique defensive behavior, warthogs will back into their burrows, tusks facing outwards, to ward off potential threats.

Paragraph D
Conservation efforts for warthogs are ongoing, as they face threats from habitat loss and hunting. While they are not currently considered endangered, their populations are affected by increasing human encroachment on their natural habitats. Warthogs also play a significant role in their ecosystems as prey for larger predators and as grazers that help in seed dispersal. Their presence contributes to the balance and health of their ecosystems, making their conservation important for the overall wellbeing of their habitats.

Paragraph E
Not given in any of the above paragraphs.
`;

const questions = [
  {
    id: 'Q1',
    text:
      'They do not dig their own burrows but rather use those that are already there as a place to live.',
  },
  {
    id: 'Q2',
    text:
      'The diet of warthogs shifts throughout the year in response to the availability of different foods.',
  },
  {
    id: 'Q3',
    text:
      'Birds like the oxpecker help warthogs by eating parasites and warning them of danger.',
  },
  {
    id: 'Q4',
    text:
      'Male warthogs that typically live alone will occasionally associate with other individuals for the purpose of mating.',
  },
  {
    id: 'Q5',
    text:
      'Warthogs are not known for their speed, but their snouts and tusks make them excellent diggers.',
  },
  {
    id: 'Q6',
    text:
      'Warthogs evolve distinctive characteristics in order to survive in their environments.',
  },
  {
    id: 'Q7',
    text:
      'Although they are not yet considered endangered, human encroachment is having an effect on their population numbers.',
  },
  {
    id: 'Q8',
    text:
      'Warthogs are known to alloparent, where individuals other than the biological parents care for the kids.',
  },
  {
    id: 'Q9',
    text:
      'Warthogs are known to exhibit social behavior in family groupings that are referred to as sounders.',
  },
];

const options = [
  { id: 'A', text: 'Paragraph A' },
  { id: 'B', text: 'Paragraph B' },
  { id: 'C', text: 'Paragraph C' },
  { id: 'D', text: 'Paragraph D' },
  { id: 'E', text: 'Not given' },
];

export default function ReadingExam2Ex3Page() {
  const router = useRouter();
  const { student, answers, setAnswer } = useReadingExam();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!student) router.replace('/reading/exam2');
  }, [student, router]);

  if (!student) return null;

  const exerciseAnswers = answers[EXERCISE_ID] || {};

  const handleChange = (qid: string, optId: string) => {
    setError('');
    setAnswer(EXERCISE_ID, qid, optId);
  };

  const handleNext = () => {
    const allAnswered = questions.every((q) => exerciseAnswers[q.id]);
    if (!allAnswered) {
      setError('Please answer all questions before continuing.');
      return;
    }

    router.push('/reading/exam2/ex4');
  };

  return (
    <main className="min-h-screen bg-[#f2eddb]">
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        <header className="space-y-1">
          <h1 className="text-xl font-bold text-[#d40000]">
            Reading Exam 2 – Part 3: Reading for Information
          </h1>
          <p className="text-sm text-gray-900 text-justify">{introText}</p>
          <p className="text-[11px] text-gray-800">
            Student: <span className="font-semibold">{student.studentName}</span> | Teacher:{' '}
            <span className="font-semibold">{student.teacherName}</span>
          </p>
        </header>

        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed text-justify whitespace-pre-line space-y-3">
          <h2 className="text-sm font-semibold text-[#d40000] mb-1">
            Text
          </h2>
          <p>{text}</p>
        </section>

        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Questions 1–9
            </p>
            <p className="text-xs text-gray-800">
              Choose the paragraph (A–D) or &quot;Not given&quot; (E).
            </p>
          </div>

          {questions.map((q) => {
            const selected = exerciseAnswers[q.id] || '';
            return (
              <div
                key={q.id}
                className="bg-[#fffcf9] border border-[#e0d6c7] rounded-lg p-4 space-y-3"
              >
                <p className="text-sm font-semibold text-gray-900 leading-snug text-justify">
                  {q.id}. {q.text}
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  {options.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.id}
                        checked={selected === opt.id}
                        onChange={() => handleChange(q.id, opt.id)}
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
