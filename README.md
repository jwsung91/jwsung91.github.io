# jwsung91.github.io

커리어 허브 + 개발 저널 통합 사이트. [Astro](https://astro.build) 기반 정적 사이트, GitHub Pages 배포.

## Stack

- **Framework:** Astro 7.0.5 (Static)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Fonts:** JetBrains Mono, Pretendard
- **Diagrams:** Mermaid (블로그 포스트 내 코드블록 자동 렌더링)
- **Deploy:** GitHub Actions → GitHub Pages

## 라우팅

| 경로                    | 설명                                                     |
| ----------------------- | -------------------------------------------------------- |
| `/`                     | 홈 — Hero, Now 프리뷰, Projects, Recent Writing          |
| `/now`                  | 현재 작업 및 관심사                                      |
| `/blog`                 | 포스트 목록 (Series / Study Notes / Site Notes / Latest) |
| `/blog/[slug]`          | 포스트 상세                                              |
| `/blog/tags/[tag]`      | 태그별 포스트 목록                                       |
| `/blog/series/[series]` | 시리즈 허브 (project 없이 존재하는 시리즈 전용)          |
| `/projects`             | 프로젝트 문서 허브                                       |
| `/projects/[slug]`      | 프로젝트 상세 (해당 프로젝트의 Series + Related Writing) |
| `/about`                | 소개 및 경력                                             |
| `/rss.xml`              | RSS 피드                                                 |

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
updatedAt: 2026-04-20 # 실질적으로 내용을 수정한 경우만 (선택)
project: wirestead # wirestead | ai-curator | site (선택)
kind: design # design | implementation | retrospective | study | note | devlog
tags: [ros2, c++]
description: 한 줄 요약
series: wirestead-design # 연속 글일 때만 (선택)
seriesOrder: 1 # series가 있으면 필수
draft: false
---
```

파일명 컨벤션: `YYYY-MM-DD-slug.md`

`project` / `kind` / `series`의 허용 값은 `src/data/taxonomy.json`에서 관리하며, `scripts/check-content.mjs`가 이 값과 CMS `config.yml`의 select 옵션이 서로 일치하는지 검증한다.

### 시리즈(Series) 노출 방식

`series`가 있는 글은 `project` 유무와 무관하게 `/blog` 인덱스의 "Series" 섹션에 카드로 묶여서 노출된다.

- `series`에 연결된 `project`가 있으면(`wirestead-design` → `wirestead` 등) 카드는 해당 프로젝트 허브(`/projects/[slug]`)로 링크되고, 그 페이지의 "Series" 섹션에서 순서대로 볼 수 있다.
- `project`가 없는 시리즈(예: `llm-core`, `llm-training`)는 전용 허브 페이지 `/blog/series/[series]`로 링크된다.

새 시리즈를 추가하려면 `src/data/taxonomy.json`의 `series` 배열에 항목을 추가하고 `config.yml`의 Series select 옵션도 함께 갱신한다 (다르면 `content:check`가 실패한다).

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
- `/wirestead/` — 라이브러리 문서 ([jwsung91/wirestead](https://github.com/jwsung91/wirestead), Doxygen)
