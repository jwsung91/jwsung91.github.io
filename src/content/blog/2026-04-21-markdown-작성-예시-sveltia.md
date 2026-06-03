---
title: Markdown 작성 예시 (Sveltia)
date: 2026-04-21
category: note
tags:
  - markdown
  - sveltia
description: Sveltia CMS raw Markdown 모드에서 frontmatter, 코드 블록, 표, Mermaid 다이어그램 작성 예시를 정리했다.
draft: false
---

Sveltia CMS의 raw Markdown 모드에서 자주 쓰는 문법을 모아둔 예시입니다. 각 항목은 먼저 작성 문법을 `md` 코드 블록으로 보여주고, 바로 아래에 렌더링 결과를 둡니다.

## 파일 상단 메타데이터

블로그 글은 파일 맨 위의 front matter로 제목, 날짜, 분류, 태그, 설명, 공개 여부를 설정합니다.

```md
---
title: Markdown 작성 예시 (Sveltia)
date: 2026-04-21
category: note
tags:
  - markdown
  - sveltia
description: Sveltia CMS raw Markdown 모드에서 사용할 수 있는 기본 문법 예시
draft: false
---
```

`draft: true`로 두면 블로그 목록과 상세 페이지에서 제외됩니다.

## 문단

```md
문단은 빈 줄로 구분합니다. 한 줄 안에서 **굵게**, *기울임*, `인라인 코드`를 사용할 수 있습니다.

취소선은 ~~이렇게~~ 작성합니다.

링크는 [Astro](https://astro.build/)처럼 작성합니다.

문장 끝에 공백 두 칸을 넣으면  
같은 문단 안에서 줄바꿈할 수 있습니다.

특수 문자를 그대로 보여주고 싶으면 백슬래시로 escape합니다. 예: \*별표 그대로 표시\*
```

문단은 빈 줄로 구분합니다. 한 줄 안에서 **굵게**, *기울임*, `인라인 코드`를 사용할 수 있습니다.

취소선은 ~~이렇게~~ 작성합니다.

링크는 [Astro](https://astro.build/)처럼 작성합니다.

문장 끝에 공백 두 칸을 넣으면  
같은 문단 안에서 줄바꿈할 수 있습니다.

특수 문자를 그대로 보여주고 싶으면 백슬래시로 escape합니다. 예: \*별표 그대로 표시\*

## 제목 계층

```md
## 제목 계층

### 세부 제목

#### 더 작은 제목
```

큰 단위는 `##`, 그 아래 단위는 `###`를 사용합니다.

### 세부 제목

세부 제목 아래에는 짧은 설명이나 예시를 붙입니다.

#### 더 작은 제목

너무 깊은 제목은 글을 읽기 어렵게 만들 수 있으니 필요한 경우에만 사용합니다.

## 목록

```md
- 순서가 없는 목록
- 두 번째 항목
  - 들여쓴 하위 항목
  - 하위 항목은 공백 두 칸으로 들여씁니다
- 항목 안에 코드를 넣을 수도 있습니다: `std::priority_queue<int>`

1. 순서가 있는 목록
2. 두 번째 항목
3. 세 번째 항목
```

- 순서가 없는 목록
- 두 번째 항목
  - 들여쓴 하위 항목
  - 하위 항목은 공백 두 칸으로 들여씁니다
- 항목 안에 코드를 넣을 수도 있습니다: `std::priority_queue<int>`

1. 순서가 있는 목록
2. 두 번째 항목
3. 세 번째 항목

## 설명형 문단

설명 목록처럼 쓰고 싶으면 굵은 라벨과 줄바꿈을 조합합니다.

```md
**문제**  
최댓값을 빠르게 꺼내야 합니다.

**해결**  
힙 기반 우선순위 큐를 사용합니다.
```

**문제**  
최댓값을 빠르게 꺼내야 합니다.

**해결**  
힙 기반 우선순위 큐를 사용합니다.

## 인용문

```md
> 인용문은 `>`로 시작합니다.
> 여러 줄을 이어서 작성할 수 있습니다.

> 인용문 안에서도 **굵게**와 `코드`를 사용할 수 있습니다.
```

> 인용문은 `>`로 시작합니다.
> 여러 줄을 이어서 작성할 수 있습니다.

> 인용문 안에서도 **굵게**와 `코드`를 사용할 수 있습니다.

## 코드 블록

언어 이름을 코드 펜스 뒤에 붙이면 문법 강조에 사용할 수 있습니다.

````md
```cpp
#include <iostream>
#include <queue>

int main() {
    std::priority_queue<int> pq;

    pq.push(10);
    pq.push(30);
    pq.push(20);

    while (!pq.empty()) {
        std::cout << pq.top() << " ";
        pq.pop();
    }

    return 0;
}
```
````

```cpp
#include <iostream>
#include <queue>

int main() {
    std::priority_queue<int> pq;

    pq.push(10);
    pq.push(30);
    pq.push(20);

    while (!pq.empty()) {
        std::cout << pq.top() << " ";
        pq.pop();
    }

    return 0;
}
```

출력 예시는 `text` 코드 블록으로 작성합니다.

````md
```text
30 20 10
```
````

```text
30 20 10
```

JSON이나 YAML도 같은 방식으로 작성합니다.

````md
```json
{
  "title": "Markdown 작성 예시",
  "draft": true,
  "tags": ["markdown", "sveltia"]
}
```

```yaml
title: Markdown 작성 예시
draft: true
tags:
  - markdown
  - sveltia
```
````

```json
{
  "title": "Markdown 작성 예시",
  "draft": true,
  "tags": ["markdown", "sveltia"]
}
```

```yaml
title: Markdown 작성 예시
draft: true
tags:
  - markdown
  - sveltia
```

## 체크리스트

```md
- [x] raw Markdown 모드에서 작성하기
- [x] 코드 블록 언어 지정하기
- [ ] 게시 전에 `draft`를 `false`로 바꾸기
```

- [x] raw Markdown 모드에서 작성하기
- [x] 코드 블록 언어 지정하기
- [ ] 게시 전에 `draft`를 `false`로 바꾸기

## 표

```md
| 문법 | 용도 |
| --- | --- |
| `**text**` | 굵게 |
| `` `code` `` | 인라인 코드 |
| 코드 펜스 + 언어 이름 | C++ 코드 블록 |
```

| 문법 | 용도 |
| --- | --- |
| `**text**` | 굵게 |
| `` `code` `` | 인라인 코드 |
| 코드 펜스 + 언어 이름 | C++ 코드 블록 |

정렬이 필요한 표는 구분선에 콜론을 붙입니다.

```md
| 이름 | 설명 | 정렬 |
| :--- | :--- | ---: |
| `push` | 값을 삽입합니다 | 오른쪽 |
| `top` | 최상위 값을 조회합니다 | 오른쪽 |
| `pop` | 최상위 값을 제거합니다 | 오른쪽 |
```

| 이름 | 설명 | 정렬 |
| :--- | :--- | ---: |
| `push` | 값을 삽입합니다 | 오른쪽 |
| `top` | 최상위 값을 조회합니다 | 오른쪽 |
| `pop` | 최상위 값을 제거합니다 | 오른쪽 |

## 이미지

이미지는 `public_folder` 기준 경로를 사용합니다.

```md
![대체 텍스트](/images/example.png)
```

이미지에 링크를 걸고 싶으면 아래처럼 감쌉니다.

```md
[![대체 텍스트](/images/example.png)](https://example.com)
```

## 자동 링크

URL을 그대로 적으면 자동 링크로 변환됩니다. 더 읽기 쉬운 문장 안에서는 일반 링크 문법을 권장합니다.

```md
https://astro.build/

[Astro 공식 사이트](https://astro.build/)
```

https://astro.build/

[Astro 공식 사이트](https://astro.build/)

## 각주

```md
본문 중간에 각주를 달 수 있습니다.[^note]

[^note]: 각주는 글 아래쪽에 모아서 표시됩니다.
```

본문 중간에 각주를 달 수 있습니다.[^note]

[^note]: 각주는 글 아래쪽에 모아서 표시됩니다.

## 접기 영역

HTML의 `details`와 `summary`는 Markdown 안에서 사용할 수 있습니다.

`````md
<details>
<summary>자세히 보기</summary>

이 영역은 사용자가 펼쳤을 때만 보입니다.

- 목록도 작성할 수 있습니다.
- 코드도 넣을 수 있습니다.

```text
hidden content
```

</details>
`````

<details>
<summary>자세히 보기</summary>

이 영역은 사용자가 펼쳤을 때만 보입니다.

- 목록도 작성할 수 있습니다.
- 코드도 넣을 수 있습니다.

```text
hidden content
```

</details>

## HTML 주석

작성 메모를 남기되 게시 화면에는 보이지 않게 하려면 HTML 주석을 사용할 수 있습니다.

```md
<!-- TODO: 발행 전에 링크와 이미지 경로를 다시 확인하기 -->
```

<!-- TODO: 발행 전에 링크와 이미지 경로를 다시 확인하기 -->

## Mermaid 다이어그램

이 프로젝트의 블로그 페이지는 `mermaid` 코드 블록을 다이어그램으로 렌더링하고, 원본 소스는 접힌 영역에서 확인할 수 있게 표시합니다.

````md
```mermaid
flowchart TD
    A[Markdown 작성] --> B[Sveltia CMS 저장]
    B --> C[Astro 렌더링]
    C --> D[블로그 게시]
```
````

```mermaid
flowchart TD
    A[Markdown 작성] --> B[Sveltia CMS 저장]
    B --> C[Astro 렌더링]
    C --> D[블로그 게시]
```

## 구분선

아래처럼 하이픈 세 개로 구분선을 만들 수 있습니다.

```md
---
```

---

구분선 아래의 새 문단입니다.
