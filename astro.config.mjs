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
    const visit = (node, index, parent) => {
      if (node?.type === 'code' && node.lang === 'mermaid' && parent && typeof index === 'number') {
        parent.children[index] = {
          type: 'html',
          value: `<div class="mermaid not-prose">\n${escapeHtml(node.value)}\n</div>`,
        };
        return;
      }

      if (Array.isArray(node?.children)) {
        node.children.forEach((child, childIndex) => visit(child, childIndex, node));
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
