---
title: '[AI Curator] 파이프라인 구축기 — 실제 구현'
date: 2026-04-25
project: ai-curator
kind: implementation
tags:
  - ai-curator
description: 'GitHub Actions와 Gemini API를 활용해 기술 뉴스를 자동 수집·요약하고 Astro 정적 사이트로 배포하는 과정을 정리합니다.'
series: 'ai-curator-pipeline'
seriesOrder: 2
draft: false
---

> 이 글은 2026-04-23에 작성한 설계 방안 포스트의 실제 구현 버전입니다.
> 설계 단계와 달라진 부분을 포함해 현재 작동 중인 상태를 기록합니다.

## 결과물

[jwsung91.github.io/ai-curator](https://jwsung91.github.io/ai-curator/) — 매일 KST 06:00에 자동 생성되는 기술 데일리 리포트.

---

## 아키텍처

```text
GitHub Actions (daily cron, KST 06:00)
  → scripts/main.py
    → 소스 수집 (10개 RSS/Atom 피드)
    → Gemini Flash API 호출 (JSON 응답)
    → reports/daily/YYYY-MM-DD.md 생성 및 커밋
  → astro build
  → GitHub Pages 배포
```

서버 없음. 별도 DB 없음. 마크다운 파일과 GitHub Actions만으로 돌아간다.

---

## 기술 스택

| 계층        | 기술                                        |
| ----------- | ------------------------------------------- |
| 데이터 수집 | Python, feedparser, urllib                  |
| LLM         | Google Gemini Flash (`gemini-flash-latest`) |
| 프론트엔드  | Astro 6 (SSG), Tailwind CSS v4              |
| CI/CD       | GitHub Actions                              |
| 호스팅      | GitHub Pages                                |

---

## 데이터 파이프라인

### 소스 (10개)

| 섹션        | 소스                                                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| 🤖 로보틱스 | ROS2 Discourse, ROS2 GitHub Releases                                                                              |
| ✨ AI       | OpenAI Blog, Google DeepMind, Simon Willison's Weblog, Changelog, HackerNews (키워드 필터), devai GitHub Releases |
| 📈 트렌드   | IEEE Spectrum Robotics, The Robot Report                                                                          |

설계 당시 ArXiv를 포함했었는데, 논문 요약은 실무 리포트 톤과 맞지 않아 실용 뉴스 소스로 대체했다.

HackerNews는 전체 피드를 받아 키워드 필터로 AI/개발도구 관련 글만 추린다. 현재 필터 키워드: `claude`, `copilot`, `mcp`, `llm`, `rag`, `anthropic`, `gemini api`, `ollama` 등 약 20개.

### 중복 제거

`scripts/seen_links.json`에 최근 14일치 링크를 저장한다. 이미 리포트된 링크는 수집 단계에서 제외된다. 하루에 같은 파이프라인이 두 번 돌아도 동일 리포트가 생성되지 않도록 날짜별 파일 존재 여부를 먼저 확인한다 (`--force` 플래그로 강제 재생성 가능).

### 코드 구조

설계 단계에서는 OOP 클래스 계층(`PipelineController`, `DataSource`, `LLMClient` 등)을 계획했다. 실제로는 3개 모듈의 함수형 구조로 단순하게 구현했다.

```text
scripts/
  fetcher.py   — RSS/Atom 수집 함수 10개 + 공통 fetch_rss(), fetch_github_releases()
  builder.py   — Gemini 프롬프트, generate_summary(), save_to_markdown()
  main.py      — 파이프라인 오케스트레이션, dedup, seen_links 관리
```

### Gemini 프롬프트 전략

시니어 소프트웨어 엔지니어 페르소나로 설정하고, JSON 응답 모드(`response_mime_type: application/json`)로 구조화된 출력을 강제한다.

```json
{
  "one_sentence_summary": "오늘 가장 중요한 기술 변화 한 문장",
  "cross_insight": "- 섹션 간 연결고리 문장1\n- 문장2\n- 문장3",
  "section_robotics": "마크다운 본문",
  "section_devtools": "마크다운 본문",
  "section_industry": "마크다운 본문",
  "covered_count": 24,
  "used_indices": [1, 2, 3, ...]
}
```

`cross_insight`는 3개 섹션을 가로지르는 공통 흐름을 정확히 3개 불릿으로 요약하도록 프롬프트에서 강제한다. Rate limit(429)이나 서버 오류(503) 시 30초 대기 후 1회 재시도한다.

### 인용 번호 재배열

Gemini가 반환하는 `[N]` 인용 번호는 입력 순서 기준이다. 3개 섹션을 합쳤을 때 본문 등장 순서로 1부터 재번호 매겨 출처 목록과 일치시킨다.

## 프론트엔드

라우팅은 두 개뿐이다.

| 경로                               | 설명                                  |
| ---------------------------------- | ------------------------------------- |
| `/ai-curator/`                     | 리포트 목록 (날짜 + itemCount + 요약) |
| `/ai-curator/curation/YYYY-MM-DD/` | 날짜별 리포트 상세                    |

상세 페이지 기능:

- **목차(TOC)**: h2 섹션 자동 추출, IntersectionObserver로 현재 섹션 하이라이트
- **인용 툴팁**: `[1]` 링크에 마우스 오버 시 제목·출처·URL 팝오버 표시
- **이전/다음 네비게이션**: 날짜 순서대로 이전·다음 리포트 이동
- **다크모드**: 시스템 설정 감지 + localStorage 토글

---

## 비용

현재 Gemini Flash API 무료 티어 범위 내에서 운영 중이다. 하루 1회 호출, 입력 토큰 약 3~4k, 출력 약 1.5k 수준.

---

## 회고

설계에서 실제로 달라진 것들:

- **ArXiv 제외**: 논문 초록 요약은 실무 톤의 뉴스 리포트와 맞지 않았다.
- **OOP → 함수형**: 3개 모듈 10개 함수로도 충분했다. 확장이 필요할 때 구조를 도입해도 늦지 않다.
- **파일 경로 변경**: `src/content/` 대신 `reports/daily/`로 분리해서 파이프라인 출력물과 소스코드 경계를 명확히 했다.
- **frontmatter 간소화**: `tags`, `sources` 대신 `summary`, `itemCount`가 실제로 UI에서 쓰이는 정보였다.
