export const SERIES_META = {
  'unilink-design': {
    title: 'unilink 설계 노트',
    project: 'unilink',
    description:
      'C++ 비동기 통신 라이브러리를 설계하며 정리한 아키텍처 기록입니다.',
  },
  'ai-curator-pipeline': {
    title: 'AI Curator 파이프라인 구축기',
    project: 'ai-curator',
    description: '기술 뉴스 자동 수집·요약·배포 파이프라인 구축 기록입니다.',
  },
  'cpp-stl-study': {
    title: 'C++ STL Study',
    topic: 'cpp',
    description: 'C++ STL과 자료구조를 실무 관점에서 정리합니다.',
  },
} as const;

export type SeriesId = keyof typeof SERIES_META;

export const getSeriesMeta = (series: string) =>
  SERIES_META[series as SeriesId];
