import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { TextToSpeech } from '@/components/text-to-speech';

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
