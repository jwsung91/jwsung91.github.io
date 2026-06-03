# jwsung91.github.io

커리어 허브 + 개발 저널 통합 사이트. [Astro](https://astro.build) 기반 정적 사이트, GitHub Pages 배포.

## Stack

- **Framework:** Astro 6.1.7 (Static)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Fonts:** JetBrains Mono, Pretendard
- **Diagrams:** Mermaid (블로그 포스트 내 코드블록 자동 렌더링)
- **Deploy:** GitHub Actions → GitHub Pages

## 라우팅

| 경로           | 설명                                            |
| -------------- | ----------------------------------------------- |
| `/`            | 홈 — Hero, Now 프리뷰, Projects, Recent Writing |
| `/now`         | 현재 작업 및 관심사                             |
| `/blog`        | 포스트 목록                                     |
| `/blog/[slug]` | 포스트 상세                                     |
| `/projects`    | 프로젝트 문서 허브                              |
| `/about`       | 소개 및 경력                                    |
| `/rss.xml`     | RSS 피드                                        |

## 콘텐츠 구조

```text
src/content/
├── blog/         # 개발 포스트 (Markdown)
├── projects/     # 프로젝트 카드 (Markdown)
├── now.md        # 현재 상태
└── about.md      # 소개
```

콘텐츠 컬렉션은 `src/content.config.ts`에서 Zod 스키마로 관리.

### 블로그 포스트 frontmatter

```yaml
---
title: 제목
date: 2026-04-18
project: unilink # unilink | ai-curator | site (선택)
kind: design # design | implementation | release | retrospective | study | note
topic: cpp # cpp | ros2 | system-design | tooling | cms-site (선택)
tags: [ros2, c++]
description: 한 줄 요약
draft: false
---
```

파일명 컨벤션: `YYYY-MM-DD-slug.md`

### 프로젝트 frontmatter

```yaml
---
title: 프로젝트명
description: 설명
status: active # active | wip | archived
repo: https://github.com/...  (선택)
url: https://...              (선택)
tags: [c++, ros2]
order: 1 # 홈 표시 순서
---
```

## 다크모드

OS 설정(`prefers-color-scheme`)을 기본으로 따르고, 토글 버튼으로 수동 전환 가능. 수동 전환 시에만 `localStorage`에 저장.

## Writing

- [CMS Writing Guide](docs/cms-writing-guide.md)

## Site Policy

This site is ad-free and maintained as an open technical writing and project documentation hub.

- [Site Policy](docs/site-policy.md)

## Search

- [Google Search Console Setup](docs/search-console.md)

## 개발

```bash
npm install
npm run dev      # localhost:4321
npm run build    # dist/ 생성
```

Node.js 22 이상 필요.

## 아키텍처 메모

이 레포가 블로그까지 통합 운영. 나머지 서브패스는 별도 레포:

- `/ai-curator/` — AI 큐레이션 ([jwsung91/ai-curator](https://github.com/jwsung91/ai-curator), Astro)
- `/unilink/` — 라이브러리 문서 ([jwsung91/unilink](https://github.com/jwsung91/unilink), Doxygen)
