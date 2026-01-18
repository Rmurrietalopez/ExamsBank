'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex4';

export default function ReadingExam1Exercise4Page() {
  const router = useRouter();
  const { student, answers, setAnswer } = useReadingExam();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!student) router.replace('/reading/exam1');
  }, [student, router]);

  if (!student) return null;

  const exerciseAnswers = answers[EXERCISE_ID] || {};

  const questions = [
    {
      id: 'Q1',
      text:
        'Tailoring work schedules enhances personal commitments alongside professional obligations.',
    },
    {
      id: 'Q2',
      text:
        'Freelancing promotes skill diversification, enhancing employability in a dynamic market.',
    },
    {
      id: 'Q3',
      text:
        'Freelancing’s rise redefines career paths, expanding professional opportunities globally.',
    },
    {
      id: 'Q4',
      text:
        'New opportunities in freelancing expand access beyond conventional employment routes.',
    },
    {
      id: 'Q5',
      text: 'Freelancers often need to build a personal brand for success.',
    },
    {
      id: 'Q6',
      text:
        'Freelancing’s challenges underscore the need for resilience and self-discipline.',
    },
    {
      id: 'Q7',
      text:
        'Technology’s evolution fosters remote work, reshaping traditional job structures.',
    },
    {
      id: 'Q8',
      text:
        'Freelancers’ autonomy cultivates improved job satisfaction and personal well-being.',
    },
    {
      id: 'Q9',
      text:
        'Despite hurdles, freelancing signifies a cultural shift towards individual agency.',
    },
  ];

  const paragraphOptions = [
    { id: 'A', text: 'Paragraph A' },
    { id: 'B', text: 'Paragraph B' },
    { id: 'C', text: 'Paragraph C' },
    { id: 'D', text: 'Paragraph D' },
    { id: 'E', text: 'Not given' },
  ];

  const handleChange = (questionId: string, optionId: string) => {
    setError('');
    setAnswer(EXERCISE_ID, questionId, optionId);
  };

  const handleNext = () => {
    const allAnswered = questions.every((q) => exerciseAnswers[q.id]);
    if (!allAnswered) {
      setError('Please answer all questions before continuing.');
      return;
    }
    router.push('/reading/exam1/ex5'); 
  };

  return (
    <main className="min-h-screen bg-[#f2eddb]">
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-xl font-bold text-[#d40000]">
            Reading Exam 1 – Exercise 4
          </h1>
          <p className="text-sm text-gray-900 text-justify">
            You will read a longer informational text (for example, an article, or a website entry).
            Answer questions about facts, details, organization, and meaning.
          </p>
          <p className="text-[11px] text-gray-800">
            Student:{' '}
            <span className="font-semibold">{student.studentName}</span> | Teacher:{' '}
            <span className="font-semibold">{student.teacherName}</span>
          </p>
        </header>

        {/* Reading Text */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed text-justify space-y-4">
          <h2 className="text-base font-semibold text-[#d40000] mb-1">
            Reading Part 3 – Reading for Information
          </h2>
          <div>
            <p className="font-semibold">Paragraph A</p>
            <p>
              In recent years, online freelancing has surged in popularity,
              transforming the traditional job landscape. With advancements in
              technology and the internet, platforms like Upwork, Fiverr, and
              Freelancer have emerged, connecting clients with skilled
              professionals across the globe. This trend has been accelerated by
              the COVID-19 pandemic, which forced many to seek remote work
              opportunities as businesses adapted to new operational realities.
              As a result, freelancing has become a viable and often lucrative
              career path for individuals looking to leverage their skills in a
              flexible work environment.
            </p>
          </div>

          <div>
            <p className="font-semibold">Paragraph B</p>
            <p>
              One of the most significant impacts of online freelancing is the
              increased flexibility it offers professionals. Unlike traditional
              nine-to-five jobs, freelancers can set their own hours and choose
              the projects they want to work on. This flexibility allows
              individuals to tailor their work schedules to fit personal
              commitments, such as family responsibilities or education. For
              many, this newfound autonomy fosters a better work-life balance,
              leading to increased job satisfaction and overall well-being.
            </p>
          </div>

          <div>
            <p className="font-semibold">Paragraph C</p>
            <p>
              The rise of freelancing has also opened doors to diverse career
              opportunities that may not have been accessible through
              conventional employment. Individuals can now explore various
              fields, from graphic design and content writing to programming and
              digital marketing, without the constraints of a permanent
              position. This shift has encouraged professionals to diversify
              their skill sets and pursue multiple income streams, enhancing
              their employability and resilience in an ever-changing job market.
            </p>
          </div>

          <div>
            <p className="font-semibold">Paragraph D</p>
            <p>
              While the rise of online freelancing offers numerous advantages,
              it also presents challenges. Freelancers often face income
              instability, lack of benefits, and the need for self-discipline to
              manage their workload effectively. Additionally, navigating the
              competitive landscape can be daunting, as freelancers must
              continually market their skills and stay updated with industry
              trends. Despite these hurdles, the growing acceptance of
              freelancing as a legitimate career choice reflects a significant
              shift in how work is perceived, emphasizing flexibility,
              creativity, and individual agency in the modern workforce.
            </p>
          </div>

          <div>
            <p className="font-semibold">Paragraph E</p>
            <p>Not given in any of the above paragraphs.</p>
          </div>
        </section>

        {/* Questions */}
        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">
              📍 Questions (1–9)
            </p>
            <p className="text-xs text-gray-800 text-justify">
              Choose the paragraph that best matches the information.
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {paragraphOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 text-sm text-gray-900 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.id}
                        checked={selected === opt.id}
                        onChange={() => handleChange(q.id, opt.id)}
                        className="h-4 w-4 accent-[#d40000]"
                      />
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Error */}
        {error && <p className="text-xs text-red-600">{error}</p>}

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
