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

export default function Layout({ children }: { children: ReactNode }) {
  const tabsTransform = (option: any, node: any) => {
    const parts = option.url.split('/').filter(Boolean);
    const section = parts[0] === 'docs' ? parts[1] : parts[0];
    const icons: Record<string, ReactNode> = {
      'claude-for-legal': (
        <ProductIcon color="#0d9488">
          <path d="M12 3v18M8 8h8M8 12h8M8 16h5" />
          <rect x="4" y="3" width="16" height="18" rx="2" />
        </ProductIcon>
      ),
      framework: (
        <ProductIcon color="#f59e0b">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
        </ProductIcon>
      ),
      ui: (
        <ProductIcon color="#3b82f6">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M8 4v16M3 9h18" />
        </ProductIcon>
      ),
      core: (
        <ProductIcon color="#6d5dfc">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" />
        </ProductIcon>
      ),
      language: (
        <ProductIcon color="#10b981">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18" />
          <path d="M3.6 9h16.8M3.6 15h16.8" />
        </ProductIcon>
      ),
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
