'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex3';

const questions = [
  { id: 'Q1', prompt: '1. Is the future of organ donation a collaborative vision, or will innovation leave some behind?' },
  { id: 'Q2', prompt: '2. Can lab-grown tissues eliminate the fear of organ rejection and donor scarcity in aging societies?' },
  { id: 'Q3', prompt: '3. What happens when groundbreaking medical advancements remain out of reach due to economic disparity?' },
  { id: 'Q4', prompt: '4. Bioengineered organs blur the line between biology and technology, redefining the boundaries of life and survival.' },
  { id: 'Q5', prompt: '5. Could artificial organs, born from collaboration, be the ultimate equalizer in global healthcare?' },
  { id: 'Q6', prompt: '6. Innovative devices bridge the gap between failure and survival—are they the cure or a stopgap.' },
  { id: 'Q7', prompt: '7. The pursuit of artificial organs demands a balance between technological ambition and the moral compass of humanity.' },
  { id: 'Q8', prompt: '8. As synthetic organs evolve, do we risk relying too much on manufactured humanity.' },
  { id: 'Q9', prompt: '9. Can cutting-edge technology overcome ethical dilemmas and fears of misuse in healthcare systems.' },
];

const options = [
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B' },
  { id: 'C', label: 'C' },
  { id: 'D', label: 'D' },
  { id: 'E', label: 'E (Not given)' },
];

export default function ReadingExam4Ex3Page() {
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

    router.push('/reading/exam4/ex4');
  };

  return (
    <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-10 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
            Reading Exam 4 · Part 3
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            Reading for Information
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            Read the text and choose the paragraph (A–D) that matches each statement, or E if it is not given.
          </p>
        </header>

        <section className="space-y-3 text-sm md:text-base">
          <h2 className="text-sm font-semibold text-[#1f2933]">Text</h2>
          <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 space-y-3 text-gray-900">
            <p><strong>A.</strong> Artificial organs are transforming medicine by replicating the functions of natural organs for patients with organ failure. Devices like artificial hearts and dialysis machines bridge the gap between failure and transplantation. Emerging technologies like bioprinting and tissue engineering are enabling the development of bioartificial organs. These innovations promise to reduce dependency on organ donors and waiting lists. By integrating seamlessly with the human body, they offer a new lease on life for countless patients.</p>
            <p><strong>B.</strong> The global shortage of organ donors has created an urgent need for alternatives like artificial organs. Lab-grown tissues, personalized using a patient’s cells, minimize rejection risks and improve outcomes. Synthetic organs made from durable materials could become replacements in the future. These solutions could save lives by providing options for patients unable to find donors in time. As the population ages, artificial organs will play a crucial role in addressing rising healthcare demands.</p>
            <p><strong>C.</strong> Despite their promise, artificial organs face challenges like high costs that make them inaccessible to many. The research, production, and maintenance of these devices require significant financial investment. Ethical concerns, such as fair patient prioritization and profit-driven motives, also pose challenges. Additionally, questions about long-term durability and safety make some providers cautious. Overcoming these hurdles is essential for the widespread adoption of this transformative technology.</p>
            <p><strong>D.</strong> Collaboration between scientists, healthcare providers, and policymakers is crucial for advancing artificial organs. Emerging tools like 3D printing, nanotechnology, and bioprint pathways can create affordable solutions. Governments must provide funding and ensure equitable access for all patients. Public awareness campaigns can promote trust and transparency around these innovations. With continued progress, artificial organs could redefine medical practice, saving countless lives and redefining medical possibilities.</p>
            <p><strong>E.</strong> Not given in any of the above paragraphs.</p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <p className="text-sm md:text-base font-medium text-[#1f2933]">
                  {q.prompt}
                </p>

                <select
                  value={(currentAnswers[q.id] as string | undefined) || ''}
                  onChange={(e) => setAnswer(EXERCISE_ID, q.id, e.target.value)}
                  className="w-full sm:w-56 rounded-md border border-[#c4baad] bg-[#fffcf9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d40000]"
                >
                  <option value="">Choose A–E</option>
                  {options.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
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
