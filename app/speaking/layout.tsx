import { ReactNode } from 'react';
import { SpeakingExamProvider } from '@/context/SpeakingExamContext';

export default function SpeakingLayout({ children }: { children: ReactNode }) {
  return <SpeakingExamProvider>{children}</SpeakingExamProvider>;
}
