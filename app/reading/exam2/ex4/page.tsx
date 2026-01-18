'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReadingExam } from '@/context/ReadingExamContext';

const EXERCISE_ID = 'ex4';

const introText =
  'You will read a text that presents different opinions or arguments. Answer questions that compare, contrast, and analyze viewpoints.';

const text = `
Driving in Canada offers a unique experience that combines scenic beauty with diverse weather conditions and varying road rules across its provinces and territories. This article aims to provide an overview of what drivers can expect when navigating Canadian roads.

Canada is renowned for its vast, picturesque landscapes, making driving a visually appealing experience. Iconic routes like the Trans-Canada Highway stretch over 7,800 kilometers, offering a panoramic view of the country’s diverse geography. Drivers can enjoy everything from the rocky coastlines of the Atlantic provinces to the majestic mountains of British Columbia. However, the extensive distances mean that long trips require careful planning, especially in remote areas where services may be sparse.

Weather in Canada can be challenging, particularly during the winter months. Drivers must be prepared for heavy snowfall, ice, and occasionally blizzards, which can make driving hazardous. Winter tires are mandatory in some provinces like Quebec during the winter season. It’s crucial for drivers to be familiar with winter driving techniques, such as handling skidding and understanding the importance of increased stopping distances on icy roads.

Traffic laws in Canada can vary significantly from province to province. For instance, while right turns on red lights are permitted in most areas, they are prohibited in certain cities like Montreal. Speed limits also vary, generally ranging from 50 km/h in urban areas to 80–110 km/h on highways, though drivers must always adhere to posted signs to familiarize themselves with the local traffic regulations.

Canada’s diverse wildlife also poses a hazard to motorists because of wildlife crossings. Collisions with large animals such as deer, moose, and bears can be dangerous. Many highways in these regions have wildlife warning signs and protective fencing to reduce risks. Drivers should remain alert, especially in rural and forested areas, where wildlife is most active.

In major urban centers like Toronto, Vancouver, and Montreal, heavy traffic and complex road networks create additional driving challenges. Drivers must navigate stop-and-go traffic, numerous pedestrians, and complex intersections. Traffic regulations in cities can be strict, and it’s advisable to understand the local parking rules to avoid violations.

Canadian drivers are generally known for their politeness, and this extends to their driving habits. Road rage is relatively rare, and drivers are expected to be courteous, such as allowing pedestrians to cross and not blocking intersections. Additionally, bilingual traffic signs are common in certain provinces like Quebec, where both English and French are used.
`;

const mcQuestions = [
  {
    id: 'Q1',
    text: 'Right turns on red lights are prohibited in ________.',
    options: [
      { id: 'A', text: 'Toronto' },
      { id: 'B', text: 'Vancouver' },
      { id: 'C', text: 'Montreal' },
      { id: 'D', text: 'Calgary' },
    ],
  },
  {
    id: 'Q2',
    text: 'Traffic signs in Quebec are unique because ________.',
    options: [
      { id: 'A', text: 'they are only in French' },
      { id: 'B', text: 'they use symbols instead of words' },
      { id: 'C', text: 'they are fluent in two languages' },
      { id: 'D', text: 'they are electronic and changeable' },
    ],
  },
  {
    id: 'Q3',
    text: 'A characteristic of Canadian drivers is their ________.',
    options: [
      { id: 'A', text: 'aggressive driving' },
      { id: 'B', text: 'courtesy on the road' },
      { id: 'C', text: 'frequent use of horns' },
      { id: 'D', text: 'ignoring pedestrian crossings' },
    ],
  },
  {
    id: 'Q4',
    text: 'Driving in rural parts of Canada can be challenging due to ________.',
    options: [
      { id: 'A', text: 'frequent rest areas' },
      { id: 'B', text: 'dense traffic' },
      { id: 'C', text: 'the limited availability of services' },
      { id: 'D', text: 'numerous toll roads' },
    ],
  },
  {
    id: 'Q5',
    text: 'On icy roads in Canada, drivers should increase their ________.',
    options: [
      { id: 'A', text: 'speed' },
      { id: 'B', text: 'following distance' },
      { id: 'C', text: 'use of high beams' },
      { id: 'D', text: 'use of car horn' },
    ],
  },
];

const completionText = `
Visiting Canada and experiencing its diverse landscapes through driving is truly a {{BLANK6}}. The vastness of this country is awe-inspiring, with iconic routes like the Trans-Canada Highway offering breathtaking views of its diverse {{BLANK7}}. However, it’s essential to plan {{BLANK8}} for long journeys, especially in remote areas. Canada’s weather can be unforgiving, particularly in winter, so being prepared for snow and ice is a must, including having {{BLANK9}} where required. Understanding the varying traffic rules across provinces is crucial, as they can differ significantly, and being aware of wildlife crossings in rural areas is vital for safety. In bustling cities like Toronto, Vancouver, and Montreal, urban driving can be challenging, but Canadians’ {{BLANK10}} on the road makes the experience relatively smooth.
`;

const blanks = [
  {
    id: 'BLANK6',
    options: [
      { id: 'a', text: 'time-consuming' },
      { id: 'b', text: 'ordinary day' },
      { id: 'c', text: 'remarkable adventure' },
      { id: 'd', text: 'mundane routine' },
    ],
  },
  {
    id: 'BLANK7',
    options: [
      { id: 'a', text: 'geography' },
      { id: 'b', text: 'linguistics' },
      { id: 'c', text: 'unsustainable' },
      { id: 'd', text: 'approachable' },
    ],
  },
  {
    id: 'BLANK8',
    options: [
      { id: 'a', text: 'carelessly' },
      { id: 'b', text: 'meticulously' },
      { id: 'c', text: 'sloppily' },
      { id: 'd', text: 'negligently' },
    ],
  },
  {
    id: 'BLANK9',
    options: [
      { id: 'a', text: 'everything' },
      { id: 'b', text: 'essential items' },
      { id: 'c', text: 'winter tires' },
      { id: 'd', text: 'water' },
    ],
  },
  {
    id: 'BLANK10',
    options: [
      { id: 'a', text: 'carelessness' },
      { id: 'b', text: 'politeness' },
      { id: 'c', text: 'experience' },
      { id: 'd', text: 'money' },
    ],
  },
];

export default function ReadingExam2Ex4Page() {
  const router = useRouter();
  const { student, answers, setAnswer } = useReadingExam();
  const [error, setError] = useState('');

  useEffect(() => {
    if (!student) router.replace('/reading/exam2');
  }, [student, router]);

  if (!student) return null;

  const exerciseAnswers = answers[EXERCISE_ID] || {};

  const handleMcChange = (qid: string, optId: string) => {
    setError('');
    setAnswer(EXERCISE_ID, qid, optId);
  };

  const handleBlankChange = (bid: string, optId: string) => {
    setError('');
    setAnswer(EXERCISE_ID, bid, optId);
  };

  const handleFinish = () => {
    const allMcAnswered = mcQuestions.every((q) => exerciseAnswers[q.id]);
    const allBlanksAnswered = blanks.every((b) => exerciseAnswers[b.id]);

    if (!allMcAnswered || !allBlanksAnswered) {
      setError('Please answer all questions and complete all blanks before finishing.');
      return;
    }

    router.push('/reading/exam2/completed');
  };

  const renderedCompletion = completionText
    .split(/(\{\{.*?\}\})/g)
    .map((part, idx) => {
      const match = part.match(/\{\{(.*?)\}\}/);
      if (!match) return <span key={idx}>{part}</span>;

      const blankId = match[1].trim();
      const blank = blanks.find((b) => b.id === blankId);
      const selected = exerciseAnswers[blankId] || '';

      if (!blank) return <span key={idx}>[?]</span>;

      return (
        <select
          key={idx}
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
            Reading Exam 2 – Part 4: Viewpoints
          </h1>
          <p className="text-sm text-gray-900 text-justify">{introText}</p>
          <p className="text-[11px] text-gray-800">
            Student: <span className="font-semibold">{student.studentName}</span> | Teacher:{' '}
            <span className="font-semibold">{student.teacherName}</span>
          </p>
        </header>

        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed text-justify whitespace-pre-line space-y-3">
          <h2 className="text-sm font-semibold text-[#d40000] mb-1">Text</h2>
          <p>{text}</p>
        </section>

        {/* Q1–5 */}
        <section className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Questions 1–5</p>
            <p className="text-xs text-gray-800">
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

        {/* Q6–10 completion */}
        <section className="bg-[#fffcf9] border border-[#c4baad] rounded-lg p-5 text-sm text-gray-900 leading-relaxed text-justify space-y-2">
          <h2 className="text-sm font-semibold text-gray-900">Questions 6–10</h2>
          <p className="text-xs text-gray-800">
            Complete the passage by choosing the best option for each blank.
          </p>
          <div className="whitespace-pre-line">{renderedCompletion}</div>
        </section>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex justify-end pt-2">
          <button
            onClick={handleFinish}
            className="px-6 py-2 bg-[#d40000] text-white rounded-md text-sm font-semibold hover:bg-[#ba0000] transition-colors"
          >
            Finish →
          </button>
        </div>
      </div>
    </main>
  );
}
