// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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

export default defineConfig({
  site: 'https://jwsung91.github.io',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkMermaid],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
