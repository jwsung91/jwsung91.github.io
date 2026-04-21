// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

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
        const language = typeof child?.lang === 'string' ? child.lang.trim().toLowerCase() : '';

        if (child?.type === 'code' && language === 'mermaid') {
          node.children.splice(index + 1, 0, {
            type: 'html',
            value: `<div class="mermaid not-prose">\n${escapeHtml(child.value)}\n</div>`,
          });
          index += 1;
          continue;
        }

        visit(child);
      }
    };

    visit(tree);
  };
}

export default defineConfig({
  site: 'https://jwsung91.github.io',
  markdown: {
    remarkPlugins: [remarkMermaid],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
