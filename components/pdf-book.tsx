'use client';

/**
 * PdfBook — 在文档中内嵌 PDF 教材
 *
 * 使用浏览器内置的 PDF 查看器（通过 <iframe> 加载）。
 * - 零依赖、无需 CORS 配置
 * - 浏览器原生支持 HTTP Range，边下边看、无需全量下载
 * - 自带翻页、缩放、搜索、打印等工具栏
 */

interface PdfBookProps {
  src: string;
  /** 容器高度（CSS 值），默认 80vh */
  height?: string;
}

export function PdfBook({ src, height = '80vh' }: PdfBookProps) {
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card">
      <iframe
        src={src}
        title="PDF 教材"
        className="w-full"
        style={{ height }}
      />
      <div className="flex items-center justify-between gap-3 border-t border-fd-border bg-fd-secondary/40 px-3 py-2 text-xs text-fd-muted-foreground">
        <span>若下方未能正常显示 PDF，可点击右侧按钮在新标签页打开</span>
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-fd-foreground hover:bg-fd-accent"
        >
          新标签页打开
          <svg
            className="size-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
