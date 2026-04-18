# Project Context

## 이 사이트의 역할
jwsung91.github.io의 커리어 허브 (4축 플랫폼의 컴포넌트 D)

## 전체 아키텍처
- jwsung91.github.io/ → 커리어 허브 (이 레포, Astro)
- jwsung91.github.io/blog/ → 개발 저널 (별도 레포: jwsung91/blog, Chirpy)
- jwsung91.github.io/feed/ → AI 큐레이션 (별도 레포: jwsung91/feed, Astro)
- jwsung91.github.io/unilink/ → 라이브러리 문서 (jwsung91/unilink, Doxygen, 현행 유지)

## 현재 상태
- Astro 6.1.7, Node 22
- astro.config.mjs: 빈 상태
- GitHub Pages 배포 Actions 없음
- Tailwind 미설치
- 콘텐츠 컬렉션 없음

## 해야 할 것 (순서대로)
1. Tailwind 설치 (npx astro add tailwind)
2. GitHub Pages deploy.yml 작성
3. src/content/config.ts (projects 컬렉션 스키마)
4. src/content/projects/unilink.md
5. src/layouts/BaseLayout.astro
6. src/pages/index.astro (Hero, Now 프리뷰, Projects)
7. src/pages/now.astro

## 디자인 방향
- 다크 테마, font-mono
- Tailwind 색상: zinc 계열 + blue 액센트
- 불필요한 애니메이션 없음, 심플하고 기술적인 느낌

## 금지 사항
- docs/ 기능 켜지 않기 (블로그만 사용)
- 모노레포 구조 금지 (4개 레포 독립 유지)
- AI 자동 콘텐츠를 이 레포에 넣지 않기 (feed 레포 담당)
