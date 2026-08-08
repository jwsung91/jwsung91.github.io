// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';

import tailwindcss from '@tailwindcss/vite';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function remarkMermaid() {
  return (tree) => {
    const visit = (node) => {
      if (!Array.isArray(node?.children)) {
        return;
      }

      for (let index = 0; index < node.children.length; index += 1) {
        const child = node.children[index];
        const language =
          typeof child?.lang === 'string'
            ? child.lang.trim().toLowerCase()
            : '';

        if (child?.type === 'code' && language === 'mermaid') {
          const escaped = escapeHtml(child.value);

          node.children[index] = {
            type: 'html',
            value: `
<figure class="mermaid-figure not-prose">
  <div class="mermaid">${escaped}</div>
</figure>
<details class="mermaid-source not-prose">
  <summary>Mermaid source</summary>
  <pre><code class="language-mermaid">${escaped}</code></pre>
</details>
`,
          };

          continue;
        }

        visit(child);
      }
    };

    visit(tree);
  };
}

// unilink -> wirestead 리네임으로 바뀐 구 URL을 유지하기 위한 리다이렉트.
// 정적 빌드에서는 meta refresh 페이지로 생성된다.
const renamedSlugs = [
  '2026-05-31-unilink-builder-api-설계',
  '2026-05-31-unilink-unified-api-설계',
  '2026-05-31-unilink-설계-배경',
  '2026-06-02-unilink-channel-추상화-설계',
  '2026-06-02-unilink-channelfactory-설계',
  '2026-06-02-unilink-transport-계층-설계',
  '2026-06-02-unilink-wrapper-계층-설계',
  '2026-06-03-unilink-backpressure-설계',
  '2026-06-03-unilink-framer-계층-설계',
  '2026-06-03-unilink-memory-buffer-설계',
  '2026-06-03-unilink-runtimestats와-diagnostics-설계',
  '2026-06-03-unilink-설계-회고',
  '2026-07-02-unilink-tcp-nodelay-트러블슈팅',
  '2026-07-02-unilink-udp-backpressure-데드락-트러블슈팅',
];

const legacyRedirects = {
  '/projects/unilink': '/projects/wirestead',
  ...Object.fromEntries(
    renamedSlugs.map((slug) => [
      `/blog/${slug}`,
      `/blog/${slug.replace('unilink', 'wirestead')}`,
    ]),
  ),
};

export default defineConfig({
  site: 'https://jwsung91.github.io',
  integrations: [sitemap()],
  redirects: legacyRedirects,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkMermaid],
      rehypePlugins: [rehypeKatex],
    }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
