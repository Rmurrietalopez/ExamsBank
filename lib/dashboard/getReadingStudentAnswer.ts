// lib/dashboard/getReadingStudentAnswer.ts

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

type SectionKey =
  | 'readingTest1'
  | 'readingTest2'
  | 'readingTest3'
  | 'readingTest4';

type GetReadingStudentAnswerArgs = {
  submission: any;
  sectionKey: SectionKey;
  questionId: string;
};

export function getReadingStudentAnswer({
  submission,
  sectionKey,
  questionId,
}: GetReadingStudentAnswerArgs): string | null {
  if (!submission || !submission.answers) return null;

  const examId: string =
    submission.examId ||
    submission.exam_id ||
    submission.examID ||
    '';

  // 🔹 For Exam 2 & Exam 3 (ex1, ex2, ex3, ex4)
  if (examId === 'reading-exam-2' || examId === 'reading-exam-3') {
    const mapSectionToExercise: Record<
      SectionKey,
      'ex1' | 'ex2' | 'ex3' | 'ex4'
    > = {
      readingTest1: 'ex1',
      readingTest2: 'ex2',
      readingTest3: 'ex3',
      readingTest4: 'ex4',
    };

    const exKey = mapSectionToExercise[sectionKey];
    const sectionAnswers = submission.answers?.[exKey];

    if (!sectionAnswers || typeof sectionAnswers !== 'object') {
      return null;
    }

    const raw = sectionAnswers[questionId];
    if (raw == null) return null;

    return String(raw);
  }

  // 🔹 For Exam 1 (arrays of letters/numbers)
  const sectionAnswers = submission.answers?.[sectionKey];

  if (!sectionAnswers) return null;

  // Case: array
  if (Array.isArray(sectionAnswers)) {
    const qNum = parseInt(questionId.replace(/\D+/g, ''), 10);
    if (!Number.isFinite(qNum) || qNum <= 0) return null;

    const raw = sectionAnswers[qNum - 1];
    if (raw == null) return null;

    if (typeof raw === 'number') return LETTERS[raw] ?? null;

    return String(raw).toUpperCase();
  }

  // Case: object (Exam 1 alternative)
  if (typeof sectionAnswers === 'object') {
    const raw = sectionAnswers[questionId];
    if (raw == null) return null;

    if (typeof raw === 'number') return LETTERS[raw] ?? null;

    return String(raw).toUpperCase();
  }

  return null;
}
