import typography from '@tailwindcss/typography';

export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Pretendard Variable"',
          'Pretendard',
          'system-ui',
          'sans-serif',
        ],
        serif: [
          '"Noto Serif KR"',
          '"Source Han Serif KR"',
          '"Nanum Myeongjo"',
          'ui-serif',
          'Georgia',
          'serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Pretendard Variable"',
          'Pretendard',
          'ui-monospace',
          'monospace',
        ],
      },
      colors: {
        azure: {
          400: '#6f90e8',
          500: '#5777d9',
          600: '#3f5ec4',
          700: '#2c48a8',
        },
      },
    },
  },
  plugins: [typography],
};
