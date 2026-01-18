'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useSpeakingExam } from '@/context/SpeakingExamContext';
import { SPEAKING_EXAM_1, SpeakingTask } from '@/lib/constants/speakingPrompts';
import { uploadSpeakingAudio } from '@/lib/speaking/uploadSpeakingAudio';
import {
  submitSpeakingExamAttempt,
  SpeakingSubmissionTask,
} from '@/lib/speaking/submitSpeakingExam';

const EXAM_ID = 'speaking-exam-1';
const EXAM_NAME = 'Speaking Exam 1';

const TEACHERS = [
  'Miss Vero',
  'Miss Romi',
  'Miss Cami',
  'Miss Lucre',
  'Miss Andrea',
  'Miss Yanina',
];

type RecorderState = {
  status: 'idle' | 'recording' | 'stopped';
  error?: string;
};

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function SpeakingExam1Page() {
  const router = useRouter();
  const { student, tasks, startExam, setTaskAudio, setTaskUploaded, resetExam } =
    useSpeakingExam();

  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [teacherName, setTeacherName] = useState('');

  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // One recorder at a time (simpler + reliable)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [recState, setRecState] = useState<RecorderState>({ status: 'idle' });

  // simple timer display (optional)
  const [timer, setTimer] = useState<number>(0);
  const timerIntervalRef = useRef<number | null>(null);

  const tasksList = useMemo(() => SPEAKING_EXAM_1, []);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleStartExam = async (e: FormEvent) => {
    e.preventDefault();
    setStartError(null);

    if (!studentName.trim() || !email.trim() || !teacherName.trim()) {
      setStartError('Please fill in all fields before starting the exam.');
      return;
    }

    try {
      setStarting(true);
      await startExam({
        examId: EXAM_ID,
        studentName: studentName.trim(),
        email: email.trim(),
        teacherName: teacherName.trim(),
      });
    } catch (err) {
      console.error('Error starting Speaking Exam 1:', err);
      setStartError('There was a problem starting the exam. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  const canRecord = typeof window !== 'undefined' && !!navigator.mediaDevices;

  const startTimer = () => {
    setTimer(0);
    if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerIntervalRef.current) window.clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = null;
  };

  const startRecording = async (taskId: string) => {
    setSubmitError(null);

    if (!canRecord) {
      setRecState({
        status: 'idle',
        error: 'Recording is not supported in this browser/device.',
      });
      return;
    }

    // Stop any ongoing recording
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setActiveTaskId(taskId);
      setRecState({ status: 'recording' });
      startTimer();

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };

      recorder.onstop = () => {
        stopTimer();

        // Stop tracks to release mic
        stream.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });

        const previewUrl = URL.createObjectURL(blob);

        setTaskAudio(taskId, {
          blob,
          previewUrl,
          mimeType: blob.type,
          seconds: timer, // approx
        });

        setRecState({ status: 'stopped' });
        setActiveTaskId(null);
      };

      recorder.start();
    } catch (err) {
      console.error('Recording error:', err);
      stopTimer();
      setActiveTaskId(null);
      setRecState({
        status: 'idle',
        error:
          'Microphone permission denied or unavailable. Please allow microphone access and try again.',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleUploadFile = (taskId: string, file: File | null) => {
    if (!file) return;

    // cleanup existing preview url (if any)
    const prevUrl = tasks?.[taskId]?.previewUrl;
    if (prevUrl) URL.revokeObjectURL(prevUrl);

    const previewUrl = URL.createObjectURL(file);

    setTaskAudio(taskId, {
      file,
      previewUrl,
      mimeType: file.type,
      seconds: undefined,
    });
  };

  const allTasksHaveAudio = tasksList.every((t) => {
    const local = tasks?.[t.id];
    return !!(local?.blob || local?.file || local?.audioUrl);
  });

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      if (!student) {
        setSubmitError(
          'Student info is missing. Please restart the exam from the beginning.'
        );
        setSubmitting(false);
        return;
      }

      // Validate
      const missing = tasksList.filter((t) => {
        const local = tasks?.[t.id];
        return !(local?.blob || local?.file || local?.audioUrl);
      });
      if (missing.length > 0) {
        setSubmitError(
          `Please record or upload audio for all tasks before submitting. Missing: ${missing
            .map((m) => m.id)
            .join(', ')}`
        );
        setSubmitting(false);
        return;
      }

      // Upload any local blobs/files that don't have audioUrl yet
      const uploadedTasks: SpeakingSubmissionTask[] = [];

      for (const t of tasksList) {
        const local = tasks[t.id] || {};

        let audioUrl = local.audioUrl;
        let mimeType = local.mimeType;
        let seconds = local.seconds;

        if (!audioUrl) {
          const blobOrFile = local.file || local.blob;
          if (!blobOrFile) {
            throw new Error(`Missing audio for ${t.id}`);
          }

          const up = await uploadSpeakingAudio({
            attemptId: student.attemptId,
            taskId: t.id,
            blobOrFile,
          });

          audioUrl = up.url;

          // store back into context (optional, but useful)
          setTaskUploaded(t.id, { audioUrl, mimeType, seconds });
        }

        uploadedTasks.push({
          taskId: t.id,
          title: t.title,
          prompt: t.prompt,
          prepSeconds: t.prepSeconds,
          responseSeconds: t.responseSeconds,
          audioUrl: audioUrl!,
          mimeType,
          seconds,
        });
      }

      await submitSpeakingExamAttempt({
        attemptId: student.attemptId,
        examId: student.examId,
        examName: EXAM_NAME,
        studentName: student.studentName,
        studentEmail: student.email,
        teacherName: student.teacherName,
        tasks: uploadedTasks,
      });

      router.push('/speaking/completed');
    } catch (err: any) {
      console.error('Submit speaking exam error:', err);
      setSubmitError(err?.message || 'There was a problem submitting the exam.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    resetExam();
    setStudentName('');
    setEmail('');
    setTeacherName('');
    setStartError(null);
    setSubmitError(null);
    router.push('/speaking/exam1');
  };

  return (
    <main className="min-h-screen bg-[#f2eddb] px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top header */}
        <div className="bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-10 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/speaking"
              className="text-xs md:text-sm text-gray-700 hover:text-[#d40000] transition-colors"
            >
              ← Back to Speaking Exams Bank
            </Link>
            <span className="px-2 py-1 rounded-full bg-[#d40000] text-white text-[10px] uppercase tracking-wide">
              {EXAM_NAME}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
            {EXAM_NAME} · Nivel Básico
          </h1>
          <p className="text-sm md:text-base text-gray-800">
            Record and submit your answers. Your teacher will review your audio and
            contact you with feedback.
          </p>
        </div>

        {/* Start Exam (only if student not set) */}
        {!student && (
          <div className="bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-[#1f2933]">
              Student information
            </h2>

            <form onSubmit={handleStartExam} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800">
                  Full Name
                </label>
                <input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full rounded-md border border-[#c4baad] bg-[#fffcf9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d40000]"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-[#c4baad] bg-[#fffcf9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d40000]"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800">
                  Choose your teacher
                </label>
                <select
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full rounded-md border border-[#c4baad] bg-[#fffcf9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d40000]"
                >
                  <option value="">Select a teacher</option>
                  {TEACHERS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {startError && (
                <div className="md:col-span-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {startError}
                </div>
              )}

              <div className="md:col-span-3 flex gap-3">
                <button
                  type="submit"
                  disabled={starting}
                  className="px-5 py-2.5 rounded-md bg-[#d40000] text-white text-sm font-semibold hover:bg-[#ba0000] transition-colors disabled:opacity-70"
                >
                  {starting ? 'Starting…' : 'Start Exam'}
                </button>

                <Link
                  href="/speaking"
                  className="px-5 py-2.5 rounded-md border border-[#c4baad] text-sm font-semibold text-[#1f2933] bg-[#fffcf9] hover:bg-[#f2eddb] transition-colors"
                >
                  Back to Bank
                </Link>
              </div>
            </form>

            <p className="text-[11px] text-gray-600">
              Tip: Use a computer + quiet place. Allow microphone permissions when asked.
            </p>
          </div>
        )}

        {/* Tasks */}
        {student && (
          <div className="space-y-6">
            {/* Student summary */}
            <div className="bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-sm text-gray-800 space-y-1">
                  <p>
                    <strong>Student:</strong> {student.studentName}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.email}
                  </p>
                  <p>
                    <strong>Teacher:</strong> {student.teacherName}
                  </p>
                </div>
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 rounded-md border border-[#c4baad] text-sm font-semibold text-[#1f2933] bg-[#fffcf9] hover:bg-[#f2eddb] transition-colors"
                >
                  Restart exam
                </button>
              </div>
            </div>

            {/* Task cards */}
            {tasksList.map((t) => {
              const local = tasks?.[t.id] || {};
              const isActiveRecording =
                recState.status === 'recording' && activeTaskId === t.id;

              return (
                <section
                  key={t.id}
                  className="bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-8 space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
                        {EXAM_NAME} · {t.id}
                      </p>
                      <h2 className="text-lg md:text-xl font-extrabold text-[#1f2933]">
                        {t.title}
                      </h2>
                      <p className="text-sm text-gray-800">{t.instructions}</p>
                      <p className="text-xs text-gray-600">
                        Prep: <strong>{formatTime(t.prepSeconds)}</strong> · Response:{' '}
                        <strong>{formatTime(t.responseSeconds)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {local.audioUrl ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                          Uploaded ✅
                        </span>
                      ) : local.blob || local.file ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200">
                          Ready to submit
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                          Not recorded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Image (if any) */}
                  {t.imageSrc && (
                    <div className="border border-[#c4baad] rounded-2xl overflow-hidden bg-white">
                      <Image
                        src={t.imageSrc}
                        alt={`${t.id} image`}
                        width={1200}
                        height={700}
                        className="w-full h-auto"
                        priority={false}
                      />
                    </div>
                  )}

                  {/* Prompt */}
                  <div className="border border-[#c4baad] rounded-2xl bg-[#fffcf9] px-4 py-3 text-sm text-gray-900 whitespace-pre-line">
                    {t.prompt + '\n\n' + (t as SpeakingTask).instructions}
                  </div>

                  {/* Recorder controls */}
                  <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startRecording(t.id)}
                        disabled={!canRecord || recState.status === 'recording'}
                        className="px-4 py-2 rounded-md bg-[#d40000] text-white text-sm font-semibold hover:bg-[#ba0000] transition-colors disabled:opacity-70"
                      >
                        {isActiveRecording ? 'Recording…' : 'Start recording'}
                      </button>

                      <button
                        type="button"
                        onClick={stopRecording}
                        disabled={recState.status !== 'recording'}
                        className="px-4 py-2 rounded-md border border-[#c4baad] text-sm font-semibold text-[#1f2933] bg-[#fffcf9] hover:bg-[#f2eddb] transition-colors disabled:opacity-70"
                      >
                        Stop
                      </button>

                      <label className="px-4 py-2 rounded-md border border-[#c4baad] text-sm font-semibold text-[#1f2933] bg-[#fffcf9] hover:bg-[#f2eddb] transition-colors cursor-pointer">
                        Upload audio
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) =>
                            handleUploadFile(t.id, e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    </div>

                    <div className="text-xs text-gray-700">
                      {recState.status === 'recording' && activeTaskId === t.id ? (
                        <span>
                          <strong>Recording time:</strong> {formatTime(timer)}
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {recState.error ? recState.error : ' '}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Preview player */}
                  {local.previewUrl && (
                    <div className="border border-[#c4baad] rounded-2xl bg-white px-4 py-3 space-y-2">
                      <p className="text-xs font-semibold text-gray-700">
                        Preview
                      </p>
                      <audio controls src={local.previewUrl} className="w-full" />
                      <p className="text-[11px] text-gray-600">
                        If you don’t like it, record again (it will replace the previous one).
                      </p>
                    </div>
                  )}

                  {local.audioUrl && (
                    <div className="border border-green-200 rounded-2xl bg-green-50 px-4 py-3">
                      <p className="text-xs text-green-800">
                        Uploaded successfully. It will appear in the teacher dashboard.
                      </p>
                    </div>
                  )}
                </section>
              );
            })}

            {/* Submit */}
            <div className="bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-8 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#1f2933]">
                    Submit exam
                  </h3>
                  <p className="text-sm text-gray-800">
                    Make sure every task has a recording or upload.
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !allTasksHaveAudio}
                  className="px-6 py-3 rounded-md bg-[#d40000] text-white text-sm font-semibold hover:bg-[#ba0000] transition-colors disabled:opacity-70"
                >
                  {submitting ? 'Submitting…' : 'Submit Speaking Exam'}
                </button>
              </div>

              {!allTasksHaveAudio && (
                <p className="text-xs text-gray-700">
                  Missing audio for at least one task. Please complete all tasks
                  before submitting.
                </p>
              )}

              {submitError && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                  {submitError}
                </div>
              )}

              <p className="text-[11px] text-gray-600">
                After submitting, the attempt becomes locked (no further updates).
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
