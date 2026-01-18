'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useSpeakingExam } from '@/context/SpeakingExamContext';
import { uploadSpeakingAudio } from '@/lib/speaking/uploadSpeakingAudio';
import { submitSpeakingExamAttempt } from '@/lib/speaking/submitSpeakingExam';

type Task = {
  id: string; // task1..task8
  label: string; // Task 1..Task 8
  title: string;
  instructions: string;
  prompt: string;
  prepSeconds: number;
  responseSeconds: number;
  imageSrc?: string; // /exam4Image1a.jpg ...
};

const EXAM_ID = 'speaking-exam-4';
const EXAM_NAME = 'Speaking Exam 4 (Advanced)';

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
  url?: string; // local preview
  uploading?: boolean;
  uploadedURL?: string; // Storage download URL
  error?: string;
};

export default function SpeakingExam4Page() {
  const router = useRouter();
  const { student, startExam, resetExam } = useSpeakingExam();

  // ---------- Student info ----------
  const [studentName, setStudentName] = useState('');
  const [email, setEmail] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  // ---------- Tasks ----------
  const tasks: Task[] = useMemo(
    () => [
      {
        id: 'task1',
        label: 'Task 1',
        title: 'Giving Advice',
        instructions:
          'You will be asked to give advice to a friend in a specific situation. Provide clear suggestions and reasons for your advice.',
        prompt:
          'A friend is thinking about starting their own business but is unsure where to begin. Suggest steps they can take to research and plan their venture.',
        prepSeconds: 30,
        responseSeconds: 90,
      },
      {
        id: 'task2',
        label: 'Task 2',
        title: 'Talking about a Personal Experience',
        instructions:
          'You will be asked to talk about a personal experience. Give details about what happened, how you felt, and why it was important.',
        prompt:
          'Describe a time when you helped a friend through a difficult situation. What happened, how did you support him/her, and what was the impact on your friendship?',
        prepSeconds: 30,
        responseSeconds: 90,
      },
      {
        id: 'task3',
        label: 'Task 3',
        title: 'Describing a Scene',
        instructions:
          'You will see a picture. Describe as many details as you can. Talk about the people, objects, and actions you notice. Try to give a clear and complete description.',
        prompt: 'Describe the picture in as much detail as possible.',
        prepSeconds: 30,
        responseSeconds: 90,
        imageSrc: '/exam4Image1a.jpg',
      },
      {
        id: 'task4',
        label: 'Task 4',
        title: 'Making Predictions',
        instructions:
          'You will see a picture. Based on what you see, make predictions about what might happen next. Use your imagination but keep your ideas realistic. Explain why you think these things will happen.',
        prompt:
          'Look at the picture and predict what will probably happen next. Explain your reasons.',
        prepSeconds: 30,
        responseSeconds: 60,
        imageSrc: '/exam4Image2b.jpg',
      },
      {
        id: 'task5',
        label: 'Task 5',
        title: 'Comparing and Persuading',
        instructions:
          'You will be shown two options. Compare them, choose one, and persuade the other person that your choice is better.',
        prompt:
          'Your company is choosing a new training program for employees. You have two options. Choose ONE and persuade your boss that it is the better option.',
        prepSeconds: 60,
        responseSeconds: 60,
        imageSrc: '/exam4Image3c.jpg', // includes both options
      },
      {
        id: 'task6',
        label: 'Task 6',
        title: 'Dealing with a Difficult Situation',
        instructions:
          'You will be presented with a situation. Choose one of the two options provided. Explain your choice clearly and give reasons for it.',
        prompt:
          'You have been offered a promotion at work, but it means moving to another city and leaving your family.\n\nChoose ONE:\n• Talk to your family about the opportunity and consider their opinions.\n• Accept the promotion without consulting anyone.',
        prepSeconds: 60,
        responseSeconds: 60,
      },
      {
        id: 'task7',
        label: 'Task 7',
        title: 'Expressing Opinions',
        instructions:
          'You will be asked to express your opinion. Give clear reasons and at least one example to support your opinion.',
        prompt:
          'Do you think that climate change is the most pressing issue facing the world today? Explain your reasons.',
        prepSeconds: 30,
        responseSeconds: 90,
      },
      {
        id: 'task8',
        label: 'Task 8',
        title: 'Describing an Unusual Situation',
        instructions:
          'You are in a store and need to describe an item clearly. Call your boss/friend and describe it. Ask if you are allowed to buy it.',
        prompt:
          'You are at a furniture store because you need a new office chair. The one that the salesman offers you has a great discount today, but you don’t know if your boss would like that shape and size for the office. Call him/her to describe it and ask if you are allowed to buy it.',
        prepSeconds: 30,
        responseSeconds: 60,
        imageSrc: '/exam4Image4d.jpg',
      },
    ],
    []
  );

  // ---------- Recording ----------
  const [audioByTask, setAudioByTask] = useState<Record<string, TaskAudioState>>(
    {}
  );
  const [activeTaskId, setActiveTaskId] = useState<string>('task1');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const activeTask = tasks.find((t) => t.id === activeTaskId)!;

  const stopAndCleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const beginRecording = async () => {
    try {
      // clear any prior error for active task
      setAudioByTask((prev) => ({
        ...prev,
        [activeTaskId]: { ...(prev[activeTaskId] || {}), error: undefined },
      }));

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);

        setAudioByTask((prev) => {
          const prevUrl = prev[activeTaskId]?.url;
          if (prevUrl) URL.revokeObjectURL(prevUrl);

          return {
            ...prev,
            [activeTaskId]: {
              ...prev[activeTaskId],
              blob,
              url,
              uploadedURL: undefined, // new recording => requires upload again
              error: undefined,
            },
          };
        });

        stopAndCleanupStream();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      stopAndCleanupStream();
      setAudioByTask((prev) => ({
        ...prev,
        [activeTaskId]: {
          ...prev[activeTaskId],
          error:
            'Microphone access was denied or unavailable. Please allow mic permissions and try again.',
        },
      }));
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error(e);
        stopAndCleanupStream();
      } finally {
        setIsRecording(false);
      }
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

  // ---------- Start exam ----------
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

  // cleanup preview URLs + stream
  useEffect(() => {
    return () => {
      stopRecording();
      stopAndCleanupStream();
      Object.values(audioByTask).forEach((a) => {
        if (a?.url) URL.revokeObjectURL(a.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Submit exam ----------
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

      await submitSpeakingExamAttempt({
        attemptId: student.attemptId,
        examId: student.examId,
        examName: EXAM_NAME,
        studentName: student.studentName,
        studentEmail: student.email,
        teacherName: student.teacherName,
        tasks: tasks.map((t) => ({
          taskId: t.id,
          title: `${t.label}. ${t.title}`,
          prompt: `${t.instructions}\n\nPrompt: ${t.prompt}`,
          prepSeconds: t.prepSeconds,
          responseSeconds: t.responseSeconds,
          audioUrl: audioByTask[t.id]!.uploadedURL!,
          mimeType: 'audio/webm',
        })),
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

  // ---------- UI ----------
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
              Speaking Exam 4
            </span>
          </div>

          <header className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1f2933]">
              {EXAM_NAME}
            </h1>
            <p className="text-sm md:text-base text-gray-800">
              Enter your information before starting. Record each task, upload it,
              then submit the exam.
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
            Make sure you are in a quiet place and your microphone works before you begin.
          </p>
        </div>
      </main>
    );
  }

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
              Record → Upload each task → Submit the full exam.
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
                onClick={() => {
                  // stop recording when switching tasks
                  stopRecording();
                  setIsRecording(false);
                  setActiveTaskId(t.id);
                }}
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

        {/* Active task card */}
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
                Prep: {activeTask.prepSeconds}s · Response: {activeTask.responseSeconds}s
              </p>
            </div>

            <div className="min-w-[220px] flex flex-col items-end gap-2">
              <div className="text-xs text-gray-700">
                Status:{' '}
                <span className="font-semibold">
                  {isRecording ? 'Recording' : 'Ready'}
                </span>
              </div>

              <div className="flex gap-2">
                {!isRecording ? (
                  <button
                    onClick={beginRecording}
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

          {/* Image (if any) */}
          {activeTask.imageSrc && (
            <div className="border border-[#c4baad] rounded-2xl overflow-hidden bg-white">
              <div className="relative w-full h-[280px] md:h-[380px]">
                <Image
                  key={activeTask.imageSrc} // helps avoid stale image display
                  src={activeTask.imageSrc}
                  alt={`${activeTask.label} image`}
                  fill
                  className="object-contain"
                  priority={activeTask.id === 'task3'}
                />
              </div>
            </div>
          )}

          {/* Recording preview + upload */}
          <div className="border border-[#c4baad] rounded-2xl p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-sm font-semibold text-[#1f2933]">
                Recording for {activeTask.label}
              </div>
              <div className="text-xs text-gray-600">
                {isRecording ? 'Recording…' : 'Not recording'}
              </div>
            </div>

            {audioByTask[activeTask.id]?.error && (
              <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {audioByTask[activeTask.id]?.error}
              </div>
            )}

            {audioByTask[activeTask.id]?.url ? (
              <audio controls className="w-full">
                <source src={audioByTask[activeTask.id]!.url} />
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
                disabled={
                  !audioByTask[activeTask.id]?.blob ||
                  Boolean(audioByTask[activeTask.id]?.uploading)
                }
                className="px-4 py-2 rounded-md bg-[#1f2933] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {audioByTask[activeTask.id]?.uploading
                  ? 'Uploading…'
                  : audioByTask[activeTask.id]?.uploadedURL
                  ? 'Uploaded ✓ (Re-upload)'
                  : 'Upload audio'}
              </button>
            </div>

            {audioByTask[activeTask.id]?.uploadedURL && (
              <p className="text-[11px] text-gray-600 break-all">
                Saved URL: {audioByTask[activeTask.id]?.uploadedURL}
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

