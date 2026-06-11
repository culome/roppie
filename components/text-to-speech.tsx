'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/**
 * ResponsiveVoice 朗读组件
 *
 * - 选中网页中的文字，会在选区附近浮现一个小喇叭按钮
 * - 点击即用 ResponsiveVoice 朗读选中内容
 * - 会根据「当前页面语言」+「选中文本的文字特征」自动挑选正确的发音语种，
 *   避免用错误的语言读音（例如用中文音去读德语单词）
 */

// ResponsiveVoice 全局类型声明
declare global {
  interface Window {
    responsiveVoice?: {
      speak: (
        text: string,
        voice?: string,
        parameters?: Record<string, unknown>,
      ) => void;
      cancel: () => void;
      isPlaying: () => boolean;
      voiceSupport: () => boolean;
    };
  }
}

type Lang = 'de' | 'es' | 'fr' | 'it' | 'zh' | 'en';

// 各语言对应的 ResponsiveVoice voice 名称
const VOICE: Record<Lang, string> = {
  de: 'Deutsch Female',
  es: 'Spanish Female',
  fr: 'French Female',
  it: 'Italian Female',
  zh: 'Chinese Female',
  en: 'UK English Female',
};

// 从 URL 路径判断当前页面的目标语言
function detectPageLang(pathname: string): Lang {
  if (pathname.startsWith('/language/de')) return 'de';
  if (pathname.startsWith('/language/es')) return 'es';
  if (pathname.startsWith('/language/fr')) return 'fr';
  if (pathname.startsWith('/language/it')) return 'it';
  // 其余页面（核心库、框架、UI 等）内容以中文为主
  return 'zh';
}

// 统计 CJK（中日韩）字符占比，用来区分「中文注释」和「目标语言词汇」
function cjkRatio(text: string): number {
  const cjk = text.match(/[一-鿿㐀-䶿]/g)?.length ?? 0;
  const letters = text.match(/[\p{L}]/gu)?.length ?? 0;
  if (letters === 0) return 0;
  return cjk / letters;
}

/**
 * 综合判断该用哪种语言朗读：
 * - 选中文本若以中文为主 → 用中文朗读（适合读中文讲解）
 * - 否则 → 用当前页面的目标语言朗读（适合读德/西/法/意单词与例句）
 */
function pickLang(text: string, pageLang: Lang): Lang {
  const ratio = cjkRatio(text);
  if (ratio >= 0.5) return 'zh';
  // 目标语言页面但选的是拉丁字母内容，用目标语言
  if (pageLang === 'zh') {
    // 非语言页：有少量中文也按中文，否则按英文
    return ratio > 0 ? 'zh' : 'en';
  }
  return pageLang;
}

interface Anchor {
  x: number;
  y: number;
  text: string;
}

export function TextToSpeech() {
  const pathname = usePathname();
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const clear = useCallback(() => {
    setAnchor(null);
    setSpeaking(false);
  }, []);

  // 监听选区变化
  useEffect(() => {
    function handleSelection(e: Event) {
      // 点击喇叭按钮本身时不处理
      if (
        btnRef.current &&
        e.target instanceof Node &&
        btnRef.current.contains(e.target)
      ) {
        return;
      }

      // 稍作延迟，确保 selection 已更新
      window.setTimeout(() => {
        const sel = window.getSelection();
        const text = sel?.toString().trim() ?? '';

        if (!sel || sel.isCollapsed || text.length === 0) {
          clear();
          return;
        }

        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          clear();
          return;
        }

        setAnchor({
          x: rect.left + rect.width / 2,
          y: rect.top,
          text,
        });
        setSpeaking(false);
      }, 10);
    }

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);
    document.addEventListener('scroll', clear, true);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
      document.removeEventListener('scroll', clear, true);
    };
  }, [clear]);

  const speak = useCallback(() => {
    if (!anchor) return;
    const rv = window.responsiveVoice;
    if (!rv || !rv.voiceSupport()) {
      // eslint-disable-next-line no-console
      console.warn('[TTS] ResponsiveVoice 尚未加载或不被支持');
      return;
    }

    if (rv.isPlaying()) {
      rv.cancel();
      setSpeaking(false);
      return;
    }

    const pageLang = detectPageLang(pathname);
    const lang = pickLang(anchor.text, pageLang);

    setSpeaking(true);
    rv.speak(anchor.text, VOICE[lang], {
      onend: () => setSpeaking(false),
      onerror: () => setSpeaking(false),
    });
  }, [anchor, pathname]);

  // 卸载时停止朗读
  useEffect(() => {
    return () => {
      window.responsiveVoice?.cancel();
    };
  }, []);

  return (
    <AnimatePresence>
      {anchor && (
        <motion.button
          ref={btnRef}
          type="button"
          onClick={speak}
          aria-label={speaking ? '停止朗读' : '朗读选中文字'}
          initial={{ opacity: 0, scale: 0.6, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          style={{
            position: 'fixed',
            left: anchor.x,
            top: anchor.y - 46,
            transform: 'translateX(-50%)',
            zIndex: 50,
          }}
          className="flex size-9 items-center justify-center rounded-full border border-fd-border bg-fd-popover text-fd-popover-foreground shadow-lg backdrop-blur transition-colors hover:bg-fd-accent"
        >
          {speaking ? (
            // 播放中：声波动画
            <span className="flex items-end gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-0.5 rounded-full bg-current"
                  animate={{ height: [4, 12, 4] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.15,
                  }}
                />
              ))}
            </span>
          ) : (
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
