'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebaseConfig';
import { doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';

type SpeakingTask = {
  taskId?: string;          // e.g. "T1"
  title?: string;           // e.g. "Giving Advice"
  prompt?: string;          // instructions text
  prepSeconds?: number;     // 30
  responseSeconds?: number; // 90
  audioUrl?: string;        // direct downloadURL if you store it
  audio?: {
    downloadURL?: string;
    url?: string;
    path?: string;
    contentType?: string;
    durationMs?: number;
  };
};

type SpeakingSubmissionDoc = {
  studentName?: string;
  studentEmail?: string;
  teacherName?: string;
  examId?: string;
  examName?: string;
  createdAt?: string;
  submittedAt?: string;
  tasks?: SpeakingTask[];
};

function toDisplayDate(v: any): string {
  if (!v) return '—';
  if (typeof v === 'string') {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? v : d.toLocaleString();
  }
  if (v?.toDate) return (v as Timestamp).toDate().toLocaleString();
  return '—';
}

function getTaskAudioUrl(t: SpeakingTask): string | null {
  return (
    t.audioUrl ||
    t.audio?.downloadURL ||
    t.audio?.url ||
    null
  );
}

export default function SpeakingSubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [submission, setSubmission] = useState<SpeakingSubmissionDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const ref = doc(db, 'speakingExamAttempts', id);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setSubmission(null);
          return;
        }

        const data = snap.data() as any;

        setSubmission({
          studentName: data.studentName,
          studentEmail: data.studentEmail,
          teacherName: data.teacherName,
          examId: data.examId,
          examName: data.examName,
          createdAt: toDisplayDate(data.createdAt),
          submittedAt: toDisplayDate(data.submittedAt),
          tasks: Array.isArray(data.tasks) ? data.tasks : [],
        });
      } catch (err) {
        console.error('Error loading speaking submission:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this speaking submission?')) return;

    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'speakingExamAttempts', id));
      router.push('/speaking-dashboard');
    } catch (err) {
      console.error('Error deleting speaking submission:', err);
      setDeleting(false);
    }
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
            onClick={() => router.push('/speaking-dashboard')}
          >
            Back to Speaking Dashboard
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
              Speaking Submission Details
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
              onClick={() => router.push('/speaking-dashboard')}
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
          <p><strong>Exam:</strong> {submission.examName || submission.examId || '—'}</p>
          <p><strong>Created:</strong> {submission.createdAt || '—'}</p>
          <p><strong>Submitted:</strong> {submission.submittedAt || '—'}</p>
        </section>

        <section className="mt-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            Tasks & Recordings
          </h2>

          {!submission.tasks?.length ? (
            <p className="text-sm text-gray-700">No tasks found on this submission.</p>
          ) : (
            <div className="space-y-4">
              {submission.tasks.map((t, idx) => {
                const audioUrl = getTaskAudioUrl(t);
                return (
                  <div
                    key={`${t.taskId || 'task'}-${idx}`}
                    className="border border-base-300 rounded-xl p-4 bg-base-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {t.taskId ? `${t.taskId}. ` : ''}
                          {t.title || `Task ${idx + 1}`}
                        </h3>
                        {(t.prepSeconds || t.responseSeconds) && (
                          <p className="text-xs text-gray-600 mt-1">
                            Prep: {t.prepSeconds ?? '—'}s · Response: {t.responseSeconds ?? '—'}s
                          </p>
                        )}
                      </div>

                      {audioUrl ? (
                        <span className="badge badge-success badge-sm">Audio</span>
                      ) : (
                        <span className="badge badge-ghost badge-sm">No audio</span>
                      )}
                    </div>

                    {t.prompt && (
                      <p className="text-sm text-gray-800 mt-3 whitespace-pre-line">
                        {t.prompt}
                      </p>
                    )}

                    <div className="mt-3">
                      {audioUrl ? (
                        <audio controls className="w-full">
                          <source src={audioUrl} />
                          Your browser does not support the audio element.
                        </audio>
                      ) : (
                        <p className="text-xs text-gray-600">
                          No audio URL stored for this task.
                        </p>
                      )}
                    </div>

                    {(t.audio?.path || t.audio?.contentType) && (
                      <div className="mt-2 text-[11px] text-gray-500">
                        {t.audio?.contentType ? (
                          <span><strong>Type:</strong> {t.audio.contentType} </span>
                        ) : null}
                        {t.audio?.path ? (
                          <span className="ml-2"><strong>Path:</strong> {t.audio.path}</span>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
