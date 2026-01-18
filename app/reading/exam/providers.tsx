'use client';

import React from 'react';
import { ReadingExamProvider } from '@/context/ReadingExamContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ReadingExamProvider>{children}</ReadingExamProvider>;
}

