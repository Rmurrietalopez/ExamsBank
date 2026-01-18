'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useSpeakingExam } from '@/context/SpeakingExamContext';
import { uploadSpeakingAudio } from '@/lib/speaking/uploadSpeakingAudio';
import {
  submitSpeakingExamAttempt,
  type SpeakingSubmissionTask,
} from '@/lib/speaking/submitSpeakingExam';

type Task = {
  id: string; // TASK1..TASK8
  label: string; // Task 1..Task 8
  title: string;
  instructions: string;
  prompt: string;
  prepSeconds: number;
  responseSeconds: number;
  imageSrc?: string; // /exam3Image1.jpg etc
};

const EXAM_ID = 'speaking-exam-3';
const EXAM_NAME = 'Speaking Exam 3 (Upper-Intermediate)';

const TEACHERS = [
  'Miss Vero',
  'Miss Romi',
  'Miss Cami',
  'Miss Lucre',
  'Miss Andrea',
  'Miss Yanina',
];

type TaskAudioState = {
  blob?: Blob;
  url?: string; // local preview url
  uploading?: boolean;
  uploadedURL?: string; // storage download url
  error?: string;
};

export default function SpeakingExam3Page() {
  const router = useRouter();
  const { student, startExam, resetExam } = useSpeakingExam();

  // ---------------------------
  // Student info (start screen)
  // ---------------------------
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  // ---------------------------
  // Tasks (from your doc)
  // ---------------------------
  const tasks: Task[] = useMemo(
    () => [
      {
        id: 'TASK1',
        label: 'Task 1',
        title: 'Giving Advice',
        instructions:
          'You will be asked to give advice to a friend in a specific situation. Provide clear suggestions and reasons for your advice.',
        prompt:
          'A friend is struggling to maintain a healthy lifestyle. Offer tips on how to eat better and stay active.',
        prepSeconds: 30,
        responseSeconds: 90,
      },
      {
        id: 'TASK2',
        label: 'Task 2',
        title: 'Talking about a Personal Experience',
        instructions:
          'You will be asked to talk about a personal experience. Give details about what happened, how you felt, and why it was important.',
        prompt:
          'Describe a time when you volunteered or participated in a community service project with friends or family. What did you do, and how did it feel to give back to the community?',
        prepSeconds: 30,
        responseSeconds: 90,
      },
      {
        id: 'TASK3',
        label: 'Task 3',
        title: 'Describing a Scene',
        instructions:
          'You will see a picture. Describe as many details as you can. Talk about the people, objects, and actions you notice. Try to give a clear and complete description.',
        prompt: 'Describe the picture in as much detail as possible.',
        prepSeconds: 30,
        responseSeconds: 90,
        imageSrc: '/exam3Image1.jpg',
      },
      {
        id: 'TASK4',
        label: 'Task 4',
        title: 'Making Predictions',
        instructions:
          'You will see a picture. Based on what you see, make predictions about what might happen next. Use your imagination but keep your ideas realistic. Explain why you think these things will happen.',
        prompt:
          'Look at the picture and predict what might happen next. Explain your reasons.',
        prepSeconds: 30,
        responseSeconds: 60,
        imageSrc: '/exam3Image2.jpg',
      },
      {
        id: 'TASK5',
        label: 'Task 5',
        title: 'Comparing and Persuading',
        instructions:
          'You will be shown two options. Compare them, choose one, and persuade the other person that your choice is better.',
        prompt:
          'You and your family are deciding where to go for summer vacation. Using the options shown, choose ONE and persuade your family it is the better choice.',
        prepSeconds: 60,
        responseSeconds: 60,
        imageSrc: '/exam3Image3.jpg', // includes both options
      },
      {
        id: 'TASK6',
        label: 'Task 6',
        title: 'Dealing with a Difficult Situation',
        instructions:
          'You will be presented with a situation. Choose one of the two options provided. Explain your choice clearly and give reasons for it.',
        prompt:
          'A close friend asks you to lend money because they are going through a financial crisis. However, you know they will not pay you back.\n\nChoose ONE:\n• Talk to your friend and explain why you cannot lend the money.\n• Lend the money and hope for the best.',
        prepSeconds: 60,
        responseSeconds: 60,
      },
      {
        id: 'TASK7',
        label: 'Task 7',
        title: 'Expressing Opinions',
        instructions:
          'You will be asked to express your opinion. Give clear reasons and at least one example to support your opinion.',
        prompt:
          'Do you think animals should be used for scientific research? Explain your reasons.',
        prepSeconds: 30,
        responseSeconds: 90,
      },
      {
        id: 'TASK8',
        label: 'Task 8',
        title: 'Describing an Unusual Situation',
        instructions:
          'You are in a store and see an unusual item. Call your friend and describe it. Ask if they want you to buy it for them.',
        prompt:
          'You are on a safari in Africa and see a very strange animal. Your camera battery died and you couldn’t take a picture. Call your friend at the end of the day and describe the animal you saw.',
        prepSeconds: 30,
        responseSeconds: 60,
        imageSrc: '/exam3Image4.jpg',
      },
    ],
    []
  );

  // ---------------------------
  // Per-task audio state
  // ---------------------------
  const [audioByTask, setAudioByTask] = useState<Record<string, TaskAudioState>>(
    {}
  );
  const [activeTaskId, setActiveTaskId] = useState<string>('TASK1');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recordingTaskIdRef = useRef<string | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  const activeTask = tasks.find((t) => t.id === activeTaskId)!;

  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const beginRecording = async (taskId: string) => {
    try {
      // stop any ongoing recording
      if (isRecording) stopRecording();

      setAudioByTask((prev) => ({
        ...prev,
        [taskId]: { ...(prev[taskId] || {}), error: undefined },
      }));

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recordingTaskIdRef.current = taskId;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);

        const tid = recordingTaskIdRef.current || taskId;

        setAudioByTask((prev) => {
          const prevUrl = prev[tid]?.url;
          if (prevUrl) URL.revokeObjectURL(prevUrl);

          return {
            ...prev,
            [tid]: {
              ...prev[tid],
              blob,
              url,
              uploadedURL: undefined, // new recording clears uploaded url
              error: undefined,
            },
          };
        });

        cleanupStream();
        recordingTaskIdRef.current = null;
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setAudioByTask((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          error:
            'Microphone access was denied or unavailable. Please allow microphone permissions and try again.',
        },
      }));
      setIsRecording(false);
      cleanupStream();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
      setIsRecording(false);
    }
  };

  const handleUploadTask = async (taskId: string) => {
    if (!student?.attemptId) {
      alert('Missing attempt ID. Please restart the exam.');
      return;
    }

    const st = audioByTask[taskId];
    if (!st?.blob) {
      alert('No recording found for this task.');
      return;
    }

    try {
      setAudioByTask((prev) => ({
        ...prev,
        [taskId]: { ...prev[taskId], uploading: true, error: undefined },
      }));

      const result = await uploadSpeakingAudio({
        attemptId: student.attemptId,
        taskId,
        blobOrFile: st.blob,
      });

      setAudioByTask((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          uploading: false,
          uploadedURL: result.url,
        },
      }));
    } catch (e: any) {
      console.error(e);
      setAudioByTask((prev) => ({
        ...prev,
        [taskId]: {
          ...prev[taskId],
          uploading: false,
          error: e?.message || 'Upload failed.',
        },
      }));
    }
  };

  const allUploaded = useMemo(() => {
    return tasks.every((t) => Boolean(audioByTask[t.id]?.uploadedURL));
  }, [tasks, audioByTask]);

  // ---------------------------
  // Start exam
  // ---------------------------
  const handleStart = async (e: React.FormEvent) => {
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
      console.error(err);
      setStartError('There was a problem starting the exam. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  // cleanup previews on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      cleanupStream();
      Object.values(audioByTask).forEach((a) => {
        if (a?.url) URL.revokeObjectURL(a.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------
  // Submit exam
  // ---------------------------
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitExam = async () => {
    if (!student?.attemptId) {
      setSubmitError('Missing attempt ID. Please restart the exam.');
      return;
    }
    if (!allUploaded) {
      setSubmitError('Please upload the audio for all tasks before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const submissionTasks: SpeakingSubmissionTask[] = tasks.map((t) => ({
        taskId: t.id,
        title: `${t.label}: ${t.title}`,
        prompt: `${t.instructions}\n\nPrompt: ${t.prompt}${
          t.imageSrc ? `\n\nImage: ${t.imageSrc}` : ''
        }`,
        prepSeconds: t.prepSeconds,
        responseSeconds: t.responseSeconds,
        audioUrl: audioByTask[t.id]!.uploadedURL!,
        mimeType: 'audio/webm',
      }));

      await submitSpeakingExamAttempt({
        attemptId: student.attemptId,
        examId: student.examId,
        examName: EXAM_NAME,
        studentName: student.studentName,
        studentEmail: student.email,
        teacherName: student.teacherName,
        tasks: submissionTasks,
      });

      resetExam();
      router.push('/speaking/completed');
    } catch (e: any) {
      console.error(e);
      setSubmitError(e?.message || 'There was a problem submitting the exam.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------
  // UI: Start screen
  // ---------------------------
  if (!student) {
    return (
      <main className="min-h-screen bg-[#f2eddb] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl bg-[#fffcf9] border border-[#c4baad] shadow-xl rounded-3xl p-8 md:p-10 space-y-6">
          <div className="flex items-center justify-between gap-2 text-xs md:text-sm">
            <Link
              href="/speaking"
              className="inline-flex items-center gap-1 text-gray-700 hover:text-[#d40000] transition-colors"
            >
              ← Back to Speaking Exams Bank
            </Link>
            <span className="px-2 py-1 rounded-full bg-[#d40000] text-white text-[10px] uppercase tracking-wide">
              Speaking Exam 3
            </span>
          </div>

          <header className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
              {EXAM_NAME}
            </h1>
            <p className="text-sm md:text-base text-gray-800">
              Enter your information before starting. Your teacher will review
              your recordings and contact you with feedback.
            </p>
          </header>

          <form onSubmit={handleStart} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-800">
                Full Name
              </label>
              <input
                type="text"
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
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {startError}
              </p>
            )}

            <div className="pt-2 flex flex-wrap gap-3">
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
                Back to Speaking Bank
              </Link>
            </div>
          </form>

          <p className="text-[11px] text-gray-600 mt-2">
            Make sure you are in a quiet place and your microphone works before
            you begin.
          </p>
        </div>
      </main>
    );
  }

  // ---------------------------
  // UI: Single page exam
  // ---------------------------
  const activeAudio = audioByTask[activeTask.id];

  return (
    <main className="min-h-screen bg-[#f2eddb] px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#ba8437] uppercase">
              {EXAM_NAME}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
              Speaking Practice
            </h1>
            <p className="text-sm text-gray-800">
              Record each task, upload it, then submit the full exam.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/speaking" className="btn btn-outline btn-sm">
              Back to Bank
            </Link>
          </div>
        </div>

        {/* Student summary */}
        <div className="bg-[#fffcf9] border border-[#c4baad] rounded-2xl shadow-sm p-4">
          <div className="text-sm text-gray-800 grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <strong>Student:</strong> {student.studentName}
            </div>
            <div>
              <strong>Email:</strong> {student.email}
            </div>
            <div>
              <strong>Teacher:</strong> {student.teacherName}
            </div>
          </div>
        </div>

        {/* Task selector */}
        <div className="bg-[#fffcf9] border border-[#c4baad] rounded-2xl shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            {tasks.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTaskId(t.id)}
                className={`px-3 py-2 rounded-md text-sm font-semibold border transition-colors ${
                  t.id === activeTaskId
                    ? 'bg-[#fcebea] border-[#d40000] text-[#1f2933]'
                    : 'bg-[#fffcf9] border-[#c4baad] text-gray-700 hover:bg-[#f2eddb]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active task */}
        <div className="bg-[#fffcf9] border border-[#c4baad] rounded-3xl shadow-xl p-6 md:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#1f2933]">
                {activeTask.label}. {activeTask.title}
              </h2>
              <p className="text-sm text-gray-800 whitespace-pre-line">
                {activeTask.instructions}
              </p>
              <p className="text-sm text-gray-900 whitespace-pre-line mt-2">
                <strong>Prompt:</strong> {activeTask.prompt}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Prep time: {activeTask.prepSeconds}s · Response time:{' '}
                {activeTask.responseSeconds}s
              </p>
            </div>

            <div className="min-w-[240px] flex flex-col items-end gap-2">
              <div className="text-xs text-gray-700">
                Status:{' '}
                <span className="font-semibold">
                  {isRecording ? 'Recording…' : 'Ready'}
                </span>
              </div>

              <div className="flex gap-2">
                {!isRecording ? (
                  <button
                    onClick={() => beginRecording(activeTask.id)}
                    className="px-4 py-2 rounded-md bg-[#d40000] text-white text-sm font-semibold hover:bg-[#ba0000] transition-colors"
                  >
                    Record
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 rounded-md border border-[#c4baad] bg-[#fffcf9] text-sm font-semibold text-[#1f2933] hover:bg-[#f2eddb] transition-colors"
                  >
                    Stop
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Image */}
          {activeTask.imageSrc && (
            <div className="border border-[#c4baad] rounded-2xl overflow-hidden bg-white">
              <div className="relative w-full h-[280px] md:h-[360px]">
                <Image
                  src={activeTask.imageSrc}
                  alt={`${activeTask.label} image`}
                  fill
                  className="object-contain"
                  priority={activeTask.id === 'TASK3'}
                />
              </div>
            </div>
          )}

          {/* Preview + upload */}
          <div className="border border-[#c4baad] rounded-2xl p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-sm font-semibold text-[#1f2933]">
                Recording for {activeTask.label}
              </div>
              <div className="text-xs text-gray-600">
                {isRecording ? 'Recording…' : 'Not recording'}
              </div>
            </div>

            {activeAudio?.error && (
              <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {activeAudio.error}
              </div>
            )}

            {activeAudio?.url ? (
              <audio controls className="w-full">
                <source src={activeAudio.url} />
                Your browser does not support audio playback.
              </audio>
            ) : (
              <p className="text-xs text-gray-600">
                No recording yet. Click <strong>Record</strong> to start.
              </p>
            )}

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => handleUploadTask(activeTask.id)}
                disabled={!activeAudio?.blob || Boolean(activeAudio?.uploading)}
                className="px-4 py-2 rounded-md bg-[#1f2933] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {activeAudio?.uploading
                  ? 'Uploading…'
                  : activeAudio?.uploadedURL
                  ? 'Uploaded ✓ (Re-upload)'
                  : 'Upload audio'}
              </button>
            </div>

            {activeAudio?.uploadedURL && (
              <p className="text-[11px] text-gray-600 break-all">
                Saved URL: {activeAudio.uploadedURL}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="bg-[#fffcf9] border border-[#c4baad] rounded-2xl shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-gray-800">
            <p className="font-semibold text-[#1f2933]">
              Upload status:{' '}
              <span className={allUploaded ? 'text-green-700' : 'text-[#d40000]'}>
                {allUploaded ? 'All tasks uploaded' : 'Missing uploads'}
              </span>
            </p>
            <p className="text-xs text-gray-600">
              You must upload all 8 recordings before submitting.
            </p>

            {submitError && (
              <p className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {submitError}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                resetExam();
                router.push('/speaking');
              }}
              className="px-4 py-2 rounded-md border border-[#c4baad] bg-[#fffcf9] text-sm font-semibold text-[#1f2933] hover:bg-[#f2eddb] transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmitExam}
              disabled={!allUploaded || submitting}
              className="px-5 py-2.5 rounded-md bg-[#d40000] text-white text-sm font-semibold hover:bg-[#ba0000] transition-colors disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit Exam'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

