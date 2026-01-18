'use client';

import { ReactNode } from 'react';
import { ReadingExamProvider } from '@/context/ReadingExamContext';

export default function Layout({ children }: { children: ReactNode }) {
  return <ReadingExamProvider>{children}</ReadingExamProvider>;
}
