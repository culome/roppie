'use client';

import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from 'motion/react';
import { useRef, type ReactNode, type MouseEvent } from 'react';

const sections = [
  {
    title: 'Language',
    zh: '语言学习',
    href: '/language/de/01',
    description: '德语、西语、法语、意语的系统学习笔记，含视频与音频。',
    color: '#10b981',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18" />
        <path d="M3.6 9h16.8M3.6 15h16.8" />
      </>
    ),
  },
  {
    title: 'Fumadocs Core',
    zh: '核心库',
    href: '/core',
    description: '无头文档库，负责内容加载、搜索与页面树生成。',
    color: '#6d5dfc',
    icon: (
      <>
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" />
      </>
    ),
  },
  {
    title: 'Framework',
    zh: '框架',
    href: '/framework',
    description: '路由约定、页面组织与文档框架的整体设计。',
    color: '#f59e0b',
    icon: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
      </>
    ),
  },
  {
    title: 'Fumadocs UI',
    zh: '界面主题',
    href: '/ui',
    description: '默认主题与可复用组件，开箱即用的精美界面。',
    color: '#3b82f6',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 4v16M3 9h18" />
      </>
    ),
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: easeOut },
  },
};

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6"
    >
      {children}
    </svg>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center"
    >
      {/* background layers */}
      <div className="hero-grid pointer-events-none absolute inset-0 -z-20" />
      <motion.div
        className="hero-orb pointer-events-none absolute -z-10 size-[38rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(109,93,252,0.22), transparent 60%)',
          top: '-10rem',
          left: '50%',
          translateX: '-50%',
        }}
      />
      <motion.div
        className="hero-orb pointer-events-none absolute -z-10 size-[26rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(16,185,129,0.18), transparent 60%)',
          top: '6rem',
          right: '8%',
          animationDelay: '-5s',
        }}
      />

      <motion.div
        style={{ y, opacity }}
        variants={container}
        initial="hidden"
        animate="show"
        className="flex max-w-3xl flex-col items-center"
      >
        <motion.span
          variants={rise}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card/60 px-4 py-1.5 text-sm text-fd-muted-foreground backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          学习笔记 · 持续更新
        </motion.span>

        <motion.h1
          variants={rise}
          className="text-balance text-5xl font-bold tracking-tight sm:text-7xl"
        >
          <span className="text-gradient">知识，</span>
          <br className="sm:hidden" />
          <span className="text-gradient">优雅地沉淀</span>
        </motion.h1>

        <motion.p
          variants={rise}
          className="mt-6 max-w-xl text-balance text-lg text-fd-muted-foreground"
        >
          语言、技术与思考的集合。一个安静、清晰、用心组织的知识库，
          随时翻阅，长久陪伴。
        </motion.p>

        <motion.div
          variants={rise}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/language/de/01"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-fd-foreground px-7 py-3 font-medium text-fd-background transition-transform hover:scale-[1.03] active:scale-95"
          >
            <span className="relative z-10">开始阅读</span>
            <svg
              className="relative z-10 size-4 transition-transform group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link
            href="/core"
            className="inline-flex items-center gap-2 rounded-full border border-fd-border px-7 py-3 font-medium transition-colors hover:bg-fd-accent"
          >
            浏览全部
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-9 w-5 items-start justify-center rounded-full border border-fd-border p-1.5"
        >
          <span className="size-1 rounded-full bg-fd-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function SectionCard({
  section,
  index,
}: {
  section: (typeof sections)[number];
  index: number;
}) {
  function onMove(e: MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }

  return (
    <motion.div
      variants={rise}
      whileHover={{ scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        href={section.href}
        onMouseMove={onMove}
        className="card-glow group flex h-full flex-col gap-4 rounded-2xl border border-fd-border bg-fd-card/50 p-7 backdrop-blur"
        style={{ ['--card-color' as string]: section.color }}
      >
        <div className="flex items-center justify-between">
          <span
            className="flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            style={{
              color: section.color,
              background: `color-mix(in oklab, ${section.color} 14%, transparent)`,
            }}
          >
            <Icon>{section.icon}</Icon>
          </span>
          <span className="text-xs font-medium tabular-nums text-fd-muted-foreground">
            0{index + 1}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold">{section.title}</h3>
          <p className="text-sm text-fd-muted-foreground">{section.zh}</p>
        </div>
        <p className="text-sm leading-relaxed text-fd-muted-foreground">
          {section.description}
        </p>
        <span
          className="mt-auto inline-flex items-center gap-1 text-sm font-medium transition-colors"
          style={{ color: section.color }}
        >
          进入
          <svg
            className="size-4 transition-transform group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>
    </motion.div>
  );
}

function Sections() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          探索内容
        </h2>
        <p className="mt-3 text-fd-muted-foreground">
          四个方向，按需取用。
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {sections.map((s, i) => (
          <SectionCard key={s.href} section={s} index={i} />
        ))}
      </motion.div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative overflow-hidden px-6 py-28">
      <div className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-30" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: easeOut }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          一点一滴，<span className="text-gradient">汇成长河</span>
        </h2>
        <p className="mt-4 text-fd-muted-foreground">
          细水长流的坚持，是学习外语与一切技能最重要的事。
        </p>
        <Link
          href="/language/de/01"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-fd-foreground px-7 py-3 font-medium text-fd-background transition-transform hover:scale-[1.03] active:scale-95"
        >
          现在开始
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Sections />
      <Closing />
    </main>
  );
}
