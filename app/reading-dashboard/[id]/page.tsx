'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';

import { correctAnswers } from '@/lib/constants/correctAnswers';
import { correctAnswersExam2 } from '@/lib/constants/correctAnswersExam2';
import { correctAnswersExam3 } from '@/lib/constants/correctAnswersExam3';
import { correctAnswers as correctAnswersExam4 } from '@/lib/constants/correctAnswersExam4';

import { getReadingStudentAnswer } from '@/lib/dashboard/getReadingStudentAnswer';

type SectionKey = 'readingTest1' | 'readingTest2' | 'readingTest3' | 'readingTest4';

type ReadingSubmissionDoc = {
  studentName?: string;
  studentEmail?: string;
  teacherName?: string;
  examId?: string;
  attemptId?: string;
  submittedAt?: string; // stringified
  answers?: any;
  scores?: any;
};

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

export default function ReadingSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [submission, setSubmission] = useState<ReadingSubmissionDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const ref = doc(db, 'readingExamAttempts', id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setSubmission(null);
          return;
        }

        const data = snap.data() as any;

        const ts = data.submittedAt as Timestamp | undefined;
        const submittedAt =
          data.submittedAtISO ||
          ts?.toDate?.()?.toLocaleString?.() ||
          '';

        setSubmission({
          studentName: data.studentName,
          studentEmail: data.studentEmail,
          teacherName: data.teacherName,
          examId: data.examId,
          attemptId: data.attemptId || id,
          submittedAt,
          answers: data.answers ?? {},
          scores: data.scores ?? {},
        });
      } catch (err) {
        console.error('Error loading submission:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this reading exam submission?')) return;

    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'readingExamAttempts', id));
      router.push('/reading-dashboard');
    } catch (err) {
      console.error('Error deleting submission:', err);
      setDeleting(false);
    }
  };

  const renderGradedSection = (sectionKey: SectionKey) => {
    if (!submission) return null;

    const examId = submission.examId || '';

    // =========================
    // EXAM 2 / EXAM 3 (map style)
    // =========================
    if (examId === 'reading-exam-2' || examId === 'reading-exam-3') {
      const isExam2 = examId === 'reading-exam-2';
      const correctSource = isExam2 ? correctAnswersExam2 : correctAnswersExam3;

      const mapSectionToExercise: Record<SectionKey, 'ex1' | 'ex2' | 'ex3' | 'ex4'> = {
        readingTest1: 'ex1',
        readingTest2: 'ex2',
        readingTest3: 'ex3',
        readingTest4: 'ex4',
      };

      const exKey = mapSectionToExercise[sectionKey];
      const correctMap = (correctSource as any)[exKey] as Record<string, string> | undefined;

      if (!correctMap) {
        return (
          <p className="text-xs text-gray-600">
            No correct answers configured for <code>{sectionKey}</code>.
          </p>
        );
      }

      const questionIds = Object.keys(correctMap).sort((a, b) => {
        const na = parseInt(a.replace(/\D+/g, ''), 10);
        const nb = parseInt(b.replace(/\D+/g, ''), 10);
        if (Number.isNaN(na) || Number.isNaN(nb)) return a.localeCompare(b);
        return na - nb;
      });

      let score = 0;

      const rows = questionIds.map((qid) => {
        const studentAnswer = getReadingStudentAnswer({
          submission,
          sectionKey,
          questionId: qid,
        });

        const correctAnswer = correctMap[qid];
        const isCorrect =
          studentAnswer != null &&
          correctAnswer != null &&
          studentAnswer.toUpperCase() === correctAnswer.toUpperCase();

        if (isCorrect) score++;

        return (
          <tr key={qid}>
            <td className="text-xs md:text-sm">{qid}</td>
            <td className="text-xs md:text-sm">{studentAnswer ?? '—'}</td>
            <td className="text-xs md:text-sm">{correctAnswer ?? '—'}</td>
            <td className="text-xs md:text-sm">
              {studentAnswer == null ? (
                <span className="text-gray-400 text-xs">—</span>
              ) : isCorrect ? (
                <span className="text-green-600 font-semibold">✅</span>
              ) : (
                <span className="text-red-600 font-semibold">❌</span>
              )}
            </td>
          </tr>
        );
      });

      return (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm md:text-base font-semibold capitalize">
              {sectionKey}
            </h3>
            <span className="text-xs md:text-sm">
              Score:{' '}
              <span className="font-semibold text-primary">
                {score}/{questionIds.length}
              </span>
            </span>
          </div>

          <div className="overflow-x-auto border border-base-300 rounded-lg">
            <table className="table table-xs md:table-sm">
              <thead>
                <tr>
                  <th>Q</th>
                  <th>Student</th>
                  <th>Correct</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>
      );
    }

    // =========================
    // EXAM 4 (numeric arrays inside correctAnswersExam4.readingExam4)
    // =========================
    if (examId === 'reading-exam-4') {
      const correctArray = (correctAnswersExam4 as any)?.readingExam4?.[sectionKey] as number[] | undefined;

      if (!correctArray) {
        return (
          <p className="text-xs text-gray-600">
            No correct answers configured for <code>{sectionKey}</code>.
          </p>
        );
      }

      const questionIds = correctArray.map((_, idx) => `Q${idx + 1}`);
      let score = 0;

      const rows = questionIds.map((qid, idx) => {
        const correctIndex = correctArray[idx];
        const correctLetter = LETTERS[correctIndex] ?? '?';

        const studentAnswer = getReadingStudentAnswer({
          submission,
          sectionKey,
          questionId: qid,
        });

        const isCorrect =
          studentAnswer != null &&
          studentAnswer.toUpperCase() === correctLetter.toUpperCase();

        if (isCorrect) score++;

        return (
          <tr key={qid}>
            <td className="text-xs md:text-sm">{qid}</td>
            <td className="text-xs md:text-sm">{studentAnswer ?? '—'}</td>
            <td className="text-xs md:text-sm">{correctLetter}</td>
            <td className="text-xs md:text-sm">
              {studentAnswer == null ? (
                <span className="text-gray-400 text-xs">—</span>
              ) : isCorrect ? (
                <span className="text-green-600 font-semibold">✅</span>
              ) : (
                <span className="text-red-600 font-semibold">❌</span>
              )}
            </td>
          </tr>
        );
      });

      return (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm md:text-base font-semibold capitalize">
              {sectionKey}
            </h3>
            <span className="text-xs md:text-sm">
              Score:{' '}
              <span className="font-semibold text-primary">
                {score}/{questionIds.length}
              </span>
            </span>
          </div>

          <div className="overflow-x-auto border border-base-300 rounded-lg">
            <table className="table table-xs md:table-sm">
              <thead>
                <tr>
                  <th>Q</th>
                  <th>Student</th>
                  <th>Correct</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>
      );
    }

    // =========================
    // DEFAULT (Exam 1)
    // =========================
    const correctArray = (correctAnswers as any)[sectionKey] as number[] | undefined;

    if (!correctArray) {
      return (
        <p className="text-xs text-gray-600">
          No correct answers configured for <code>{sectionKey}</code>.
        </p>
      );
    }

    const questionIds = correctArray.map((_, idx) => `Q${idx + 1}`);
    let score = 0;

    const rows = questionIds.map((qid, idx) => {
      const correctIndex = correctArray[idx];
      const correctLetter = LETTERS[correctIndex] ?? '?';

      const studentAnswer = getReadingStudentAnswer({
        submission,
        sectionKey,
        questionId: qid,
      });

      const isCorrect =
        studentAnswer != null &&
        studentAnswer.toUpperCase() === correctLetter.toUpperCase();

      if (isCorrect) score++;

      return (
        <tr key={qid}>
          <td className="text-xs md:text-sm">{qid}</td>
          <td className="text-xs md:text-sm">{studentAnswer ?? '—'}</td>
          <td className="text-xs md:text-sm">{correctLetter}</td>
          <td className="text-xs md:text-sm">
            {studentAnswer == null ? (
              <span className="text-gray-400 text-xs">—</span>
            ) : isCorrect ? (
              <span className="text-green-600 font-semibold">✅</span>
            ) : (
              <span className="text-red-600 font-semibold">❌</span>
            )}
          </td>
        </tr>
      );
    });

    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm md:text-base font-semibold capitalize">{sectionKey}</h3>
          <span className="text-xs md:text-sm">
            Score:{' '}
            <span className="font-semibold text-primary">
              {score}/{questionIds.length}
            </span>
          </span>
        </div>

        <div className="overflow-x-auto border border-base-300 rounded-lg">
          <table className="table table-xs md:table-sm">
            <thead>
              <tr>
                <th>Q</th>
                <th>Student</th>
                <th>Correct</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-sm text-gray-700">Loading submission…</p>
      </main>
    );
  }

  if (!submission) {
    return (
      <main className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-xl p-6">
          <p className="text-sm text-gray-700 mb-4">
            Submission not found or may have been deleted.
          </p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => router.push('/reading-dashboard')}
          >
            Back to Reading Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-base-200 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-base-100 border border-base-300 rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Reading Submission Details
            </h1>
            <p className="text-xs md:text-sm text-gray-700 mt-1">
              Submission ID:{' '}
              <span className="font-mono break-all text-[11px] md:text-xs">
                {id}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-sm md:btn-md"
              onClick={() => router.push('/reading-dashboard')}
            >
              Back
            </button>
            <button
              className="btn btn-error btn-sm md:btn-md"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>

        <section className="space-y-1 text-sm md:text-base text-gray-800">
          <p><strong>Student:</strong> {submission.studentName || '—'}</p>
          <p><strong>Email:</strong> {submission.studentEmail || '—'}</p>
          <p><strong>Teacher:</strong> {submission.teacherName || '—'}</p>
          <p><strong>Exam ID:</strong> {submission.examId || '—'}</p>
          <p><strong>Submitted at:</strong> {submission.submittedAt || '—'}</p>

          {submission.scores?.total && (
            <p>
              <strong>Total score:</strong>{' '}
              <span className="text-primary font-semibold">
                {submission.scores.total.score}/{submission.scores.total.total}
              </span>
            </p>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            Section Details
          </h2>
          {renderGradedSection('readingTest1')}
          {renderGradedSection('readingTest2')}
          {renderGradedSection('readingTest3')}
          {renderGradedSection('readingTest4')}
        </section>
      </div>
    </main>
  );
}


