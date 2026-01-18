'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex3';

const paragraphs = [
  {
    id: 'A',
    title: 'Paragraph A',
    text: `It was a fishing and racing schooner called the Bluenose. It was built in Nova Scotia, Canada, in 1921. Angus Walters led Bluenose to become a provincial symbol for Nova Scotia and an important Canadian symbol in the 1930s. Bluenose was a famous racing and fishing boat. Later, a copy of the Bluenose II was made in 1963 to honour her. It was leaking and worn out, so it was taken apart in 2010 and put back together in the same shipyard in Lunenburg, Nova Scotia, where its ancestors were built. It was launched in 2013. The name “bluenose” was first used as a nickname for people from Nova Scotia in the late 18th century.`,
  },
  {
    id: 'B',
    title: 'Paragraph B',
    text: `The Bluenose postage stamp 50 cent printing shows the ship Bluenose fully sail. The Bluenose was on a 60-cent stamp from 1982 that was used to honour the International Philatelic Youth Exhibition. The Bluenose is shown on a 37-cent stamp from 1988 that honours Bluenose captain Angus Walters. Bluenose is also on the current license plate for Nova Scotia. The fishing schooner on the Canadian dime was added in 1937, when Bluenose was at the height of its fame. It is actually a composite picture of Bluenose and two other schooners, but it has been called Bluenose for years. The Canadian government said in 2002 that the picture on the dime was of Bluenose.`,
  },
  {
    id: 'C',
    title: 'Paragraph C',
    text: `It was in 1955 that Bluenose and her captain, Angus J. Walters of Lunenburg, were inducted into the Canadian Sports Hall of Fame. She was the first and only non-human person to be admitted until 1960, when Canadian Hydroplane Champion Miss Supertest III joined her. In the same year, the sailing ship received another award. The M/V Bluenose, a new passenger vehicle ferry that ran between Yarmouth and Bar Harbour on the Canadian National Railways, was then launched. Bluenose II was the name of a copy of Bluenose that was built at Lunenburg in 1963 using the original Bluenose plans. The Oland Brewer made the copy to push their Schooner Beer sales. In 1971, Bluenose II was sold to the Nova Scotia government for $1 Canadian dollar and was used as a pleasure boat. In 1971, Bluenose II was sold to the Nova Scotia government for $1 Canadian dollar.`,
  },
  {
    id: 'D',
    title: 'Paragraph D',
    text: `The fake schooner is used to promote tourism as a “sailing ambassador.” Bluenose II does not publicly race to honour her predecessor’s record. The copy has been fixed up several times to make her last longer. This ship was taken out of service and broken down in 2010. In its place, a brand-new Bluenose (also called Bluenose II because Transport Canada called it a “reconstruction”) was made. Builders tried to make it as close like the original schooner as possible, and it was launched in 2013. Different parts of the Bluenose II project came from well-known companies. For example, Bigelow’s Shipyard in Dayspring made the ship’s keel, Covey Island Boatyorks in Riverport made the ship’s backbone of laminated ribs, and the ship was put together in Lunenburg.`,
  },
  {
    id: 'E',
    title: 'Paragraph E',
    text: 'Not given in any of the above paragraphs.',
  },
];

const questions = [
  {
    id: 'Q1',
    text: '1. The Bluenose was bought by the federal government.',
  },
  {
    id: 'Q2',
    text: '2. Journeys of the Bluenose 2 during its time in service.',
  },
  {
    id: 'Q3',
    text: '3. The Bluenose in Nova Scotian car culture in the 20th century.',
  },
  {
    id: 'Q4',
    text: '4. The reason why it was built and designed the way it was.',
  },
  {
    id: 'Q5',
    text: '5. Awards and distinctions given to the ship.',
  },
  {
    id: 'Q6',
    text: '6. Putting Canadian dollars into the Bluenose.',
  },
  {
    id: 'Q7',
    text: '7. How much the Bluenose 2 is worth right now.',
  },
  {
    id: 'Q8',
    text: '8. The Bluenose and friendly people who like to see sights.',
  },
  {
    id: 'Q9',
    text: '9. The years when the first Bluenose stopped going out.',
  },
];

const options = [
  { id: 'A', label: 'A) Paragraph A' },
  { id: 'B', label: 'B) Paragraph B' },
  { id: 'C', label: 'C) Paragraph C' },
  { id: 'D', label: 'D) Paragraph D' },
  { id: 'E', label: 'E) Not given' },
];

export default function ReadingExam3Ex3Page() {
  const router = useRouter();
  const { answers, setAnswer } = useReadingExam();
  const [error, setError] = useState<string | null>(null);

  const currentAnswers = answers[EXERCISE_ID] || {};

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const allAnswered = questions.every((q) => currentAnswers[q.id]);

    if (!allAnswered) {
      setError('Please answer all questions before continuing.');
      return;
    }

    router.push('/reading/exam3/ex4');
  };

  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-10 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
            Reading Exam 3 · Part 3
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Reading for Information
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            You will read an informational text about the Bluenose. For each
            question, choose the paragraph (A–D) that contains the information,
            or choose E for “Not given”.
          </p>
        </header>

        {/* Paragraphs */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-[#1f2933]">
            Text: The Bluenose
          </h2>
          <div className="grid gap-4 md:grid-cols-2 text-sm md:text-base">
            {paragraphs.map((p) => (
              <article
                key={p.id}
                className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-1"
              >
                <h3 className="font-semibold text-[#1f2933]">
                  {p.title}
                </h3>
                <p className="text-gray-900 whitespace-pre-line">{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Questions 1–9 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-sm md:text-base font-semibold text-[#1f2933]">
              Questions 1–9
            </h2>
            <p className="text-xs md:text-sm text-gray-700">
              For each statement, choose the paragraph (A–D) where this
              information is found, or E if it is not given in the text.
            </p>

            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <p className="text-sm md:text-base font-medium text-[#1f2933]">
                    {q.text}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm md:text-base">
                    {options.map((opt) => (
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
              Next: Part 4
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
