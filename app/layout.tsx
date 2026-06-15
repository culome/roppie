import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import Script from 'next/script';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { TextToSpeech } from '@/components/text-to-speech';

export const metadata: Metadata = {
  title: {
    default: 'LANG · 语言学习笔记',
    template: '%s · LANG',
  },
  description: '德语、西班牙语、法语、意大利语的系统学习笔记，含视频与教材。',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Script
          src="https://code.responsivevoice.org/responsivevoice.js?key=qT5zECSX"
          strategy="afterInteractive"
        />
        <RootProvider>{children}</RootProvider>
        <TextToSpeech />
      </body>
    </html>
  );
}
