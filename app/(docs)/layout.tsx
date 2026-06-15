import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootToggle } from 'fumadocs-ui/components/layout/root-toggle';
import { getSidebarTabs } from 'fumadocs-ui/utils/get-sidebar-tabs';
import type { CSSProperties, ReactNode } from 'react';
import { baseOptions } from '@/app/layout.config';
import { source } from '@/lib/source';

function ProductIcon({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <div
      className="docs-root-toggle-icon"
      style={{ '--tab-color': color } as CSSProperties}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        {children}
      </svg>
    </div>
  );
}

function FlagIcon({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="docs-root-toggle-flag">
      <svg
        role="img"
        aria-label={label}
        viewBox="0 0 24 16"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {children}
      </svg>
    </div>
  );
}

// 德国：黑 - 红 - 金（横向三条）
const GermanFlag = (
  <FlagIcon label="Deutschland">
    <rect x="0" y="0" width="24" height="5.33" fill="#000000" />
    <rect x="0" y="5.33" width="24" height="5.34" fill="#DD0000" />
    <rect x="0" y="10.67" width="24" height="5.33" fill="#FFCE00" />
  </FlagIcon>
);

// 西班牙：红 - 黄（加宽）- 红（横向）
const SpanishFlag = (
  <FlagIcon label="España">
    <rect x="0" y="0" width="24" height="16" fill="#AA151B" />
    <rect x="0" y="4" width="24" height="8" fill="#F1BF00" />
  </FlagIcon>
);

// 法国：蓝 - 白 - 红（竖向三条）
const FrenchFlag = (
  <FlagIcon label="France">
    <rect x="0" y="0" width="8" height="16" fill="#0055A4" />
    <rect x="8" y="0" width="8" height="16" fill="#FFFFFF" />
    <rect x="16" y="0" width="8" height="16" fill="#EF4135" />
  </FlagIcon>
);

// 意大利：绿 - 白 - 红（竖向三条）
const ItalianFlag = (
  <FlagIcon label="Italia">
    <rect x="0" y="0" width="8" height="16" fill="#009246" />
    <rect x="8" y="0" width="8" height="16" fill="#F1F2F1" />
    <rect x="16" y="0" width="8" height="16" fill="#CE2B37" />
  </FlagIcon>
);

export default function Layout({ children }: { children: ReactNode }) {
  const tabsTransform = (option: any, node: any) => {
    const parts = option.url.split('/').filter(Boolean);
    const section = parts[0] === 'docs' ? parts[1] : parts[0];
    const icons: Record<string, ReactNode> = {
      other: (
        <ProductIcon color="#6d5dfc">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" />
        </ProductIcon>
      ),
      de: GermanFlag,
      es: SpanishFlag,
      fr: FrenchFlag,
      it: ItalianFlag,
    };

    return {
      ...option,
      icon: section && icons[section] ? icons[section] : node.icon,
    };
  };

  const tabs = getSidebarTabs(source.pageTree, { transform: tabsTransform });

  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        ...baseOptions.nav,
        children: (
          <RootToggle
            className="md:hidden"
            options={tabs}
          />
        ),
      }}
      sidebar={{
        tabs: {
          transform: tabsTransform,
        },
      }}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
