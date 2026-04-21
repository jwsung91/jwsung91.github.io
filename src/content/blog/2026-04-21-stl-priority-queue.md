---
title: '[STL] Priority queue'
date: 2026-04-21
category: study
tags:
  - STL
  - C++
  - 자료구
description: STL 우선순위 큐 개념정리 및 예시코드
draft: false
---

## 정의

우선순위가 가장 높은(혹은 낮은) 데이터를 가장 먼저 도출되는 형태의 자료구조

- C++에서는 `std::priority_queue`가 기본적으로 제공
- 내부적으로 \*\*최대 힙(Max Heap)\*\*을 사용해서 구현되어 있음
- 정렬이 필요없는 **우선순위 기반의 데어터 처리**에 적합

### 구조

- C++의 `std::priority_queue`는 기본적으로 힙(Heap) 자료구조를 기반으로 동작
- 내부적으로 `std::vector`를 사용하며, 힙 연산을 활용하여 정렬
    - `std::make_heap`, `std::push_heap`, `std::pop_heap`

### 시간복잡도

- 삽입(push)과 삭제(pop) 연산의 시간 복잡도는 **O(log N)**
- 최댓값(top())을 가져오는 연산은 **O(1)**

### 템플릿 정의

```c
++
template <class T, class Container = std::vector<T>, class Compare = std::less<T>>
class priority_queue;
```

- T: 데이터 타입 (int, struct 등)
- Container: 내부 컨테이너 (기본값은 `std::vector<T>`)
- Compare: 정렬 기준 (기본값은 `std::less<T>`)

> `std::priority_queue`를 기본(최대 힙 방식)으로 사용하면 데이터 타입만 입력하면 됨
> {: .prompt-info }

## 사용 방법

- C++의 `<queue>`를 포함하면 사용 가능

### 최대 힙 이용(기본)

- 기본적으로 최대 힙으로 적용되어 있음

```c
#include <iostream>
#include <queue>

int main() {
    std::priority_queue<int> pq; // Default: max heap

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

기본적으로 `std::priority_queue`는 내림차순(큰 값 → 작은 값)으로 정렬됨

```text
30 20 10
```

### 최소 힙 이용

`std::priority_queue`를 선언할 때 `std::greater<>` 추가

```c
#include <iostream>
#include <queue>
#include <vector>

int main() {
    std::priority_queue<int, std::vector<int>, std::greater<int>> pq; //  min heap

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

오름차순(작은 값 → 큰 값)으로 정렬됨

```text
10 20 30
```

## 사용자 정의 구조체 적용

특정 기준으로 정렬하고 싶다면, `operator`를 오버로딩하거나 `compare` 함수를 지정

### operator 오버로딩

```c
#include <iostream>
#include <queue>

struct Task {
    int score;
    std::string name;

    // score 높은 순으로 정렬 (max heap)
    bool operator<(const Task& other) const {
        return score < other.score; 
    }
};

int main() {
    std::priority_queue<Task> pq;

    pq.push({1, "Low"});
    pq.push({3, "High"});
    pq.push({2, "Medium"});

    while (!pq.empty()) {
        std::cout << pq.top().name << " ";
        pq.pop();
    }
    return 0;
}
```

score 기준 내림차순으로 정렬됨

```text
High Medium Low
```

### compare 함수 이용

```c
#include <iostream>
#include <queue>
#include <vector>

struct Task {
    int priority;
    std::string name;
};

// priority 숫자 낮은 순으로 정렬 (min heap)
struct Compare {
    bool operator()(const Task& a, const Task& b) const {
        return a.priority > b.priority;
    }
};

int main() {
    std::priority_queue<Task, std::vector<Task>, Compare> pq; // compare 함수

    pq.push({1, "Low"});
    pq.push({3, "High"});
    pq.push({2, "Medium"});

    while (!pq.empty()) {
        std::cout << pq.top().name << " ";
        pq.pop();
    }
    return 0;
}
```

priority 기준 오름차순으로 정리됨

```text
Low Medium High
```
