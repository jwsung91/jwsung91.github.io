# Project Context

## 이 사이트의 역할

jwsung91.github.io의 커리어 허브 + 개발 저널 통합 사이트 (Astro)

## 전체 아키텍처

- jwsung91.github.io/ → 커리어 허브 + 블로그 (이 레포, Astro) ← 통합 운영
- jwsung91.github.io/feed/ → AI 큐레이션 (별도 레포: jwsung91/feed, Astro)
- jwsung91.github.io/unilink/ → 라이브러리 문서 (jwsung91/unilink, Doxygen, 현행 유지)

## 현재 상태 (2026-04-19 기준)

- Astro 6.1.7, Node 22
- Tailwind CSS v4 (@tailwindcss/vite)
- GitHub Pages deploy.yml 완료
- 콘텐츠 컬렉션: projects, blog, now
- 라우팅: /, /blog, /blog/[slug], /about, /now, /rss.xml

## 콘텐츠 구조

- src/content/blog/ — 개발 포스트 (devlog, study, adr, note 카테고리)
- src/content/projects/ — 프로젝트 카드
- src/content/now.md — 현재 상태 (홈 인라인 + /now 페이지)
- src/content/about.md — 소개

## 디자인 방향

- 라이트/다크 모드 지원 (OS 설정 연동)
- font-mono (JetBrains Mono), Pretendard (한글)
- Tailwind 색상: zinc 계열 + blue 액센트
- 불필요한 애니메이션 없음, 심플하고 기술적인 느낌

## 금지 사항

- 모노레포 구조 금지 (레포 독립 유지)
- AI 자동 콘텐츠를 이 레포에 넣지 않기 (feed 레포 담당)
