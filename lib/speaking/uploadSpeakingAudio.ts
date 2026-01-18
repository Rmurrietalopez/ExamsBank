import { storage } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type UploadArgs = {
  attemptId: string;
  taskId: string;
  blobOrFile: Blob; // can be Blob or File
};

export async function uploadSpeakingAudio({
  attemptId,
  taskId,
  blobOrFile,
}: UploadArgs): Promise<{ url: string; path: string }> {
  const ext =
    (blobOrFile as File).name?.split('.').pop()?.toLowerCase() ||
    (blobOrFile.type.includes('webm') ? 'webm' : 'dat');

  const safeExt = ext && ext.length <= 5 ? ext : 'webm';
  const path = `speaking/${attemptId}/${taskId}.${safeExt}`;

  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blobOrFile, {
    contentType: blobOrFile.type || 'application/octet-stream',
  });

  const url = await getDownloadURL(storageRef);
  return { url, path };
}
