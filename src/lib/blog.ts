import type { CollectionEntry } from 'astro:content';

export const featuredBlogSeries = [
  {
    series: 'unilink-design',
    title: 'unilink 설계 노트',
    description: 'C++ 비동기 통신 라이브러리를 설계하며 정리한 아키텍처 기록입니다.',
  },
  {
    series: 'ai-curator-pipeline',
    title: 'AI Curator 파이프라인 구축기',
    description: 'GitHub Actions, Gemini API, Astro를 활용한 자동 큐레이션 시스템 구축 기록입니다.',
  },
  {
    series: 'cpp-stl-study',
    title: 'C++ STL Study',
    description: '자료구조와 STL 사용법을 실무 관점에서 정리한 학습 노트입니다.',
  },
] as const;

export const sortBlogPosts = (posts: CollectionEntry<'blog'>[]) =>
  [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const sortBlogSeriesPosts = (posts: CollectionEntry<'blog'>[]) =>
  [...posts].sort((a, b) => {
    const orderA = a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.data.date.getTime() - b.data.date.getTime();
  });

export const groupBlogPostsBySeries = (posts: CollectionEntry<'blog'>[]) => {
  const groups = new Map<string, CollectionEntry<'blog'>[]>();

  posts.forEach((post) => {
    if (!post.data.series) {
      return;
    }

    groups.set(post.data.series, [...(groups.get(post.data.series) ?? []), post]);
  });

  return groups;
};

export const getFeaturedBlogSeries = (posts: CollectionEntry<'blog'>[]) => {
  const groupedPosts = groupBlogPostsBySeries(posts);

  return featuredBlogSeries
    .map((series) => {
      const seriesPosts = sortBlogSeriesPosts(groupedPosts.get(series.series) ?? []);
      const firstPost = seriesPosts[0];

      if (!firstPost) {
        return null;
      }

      return {
        ...series,
        posts: seriesPosts,
        firstPost,
      };
    })
    .filter((series): series is NonNullable<typeof series> => series !== null);
};

export const formatSeriesTitle = (series: string) =>
  series
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const getBlogSeriesNav = (post: CollectionEntry<'blog'>, posts: CollectionEntry<'blog'>[]) => {
  const series = post.data.series;

  if (!series) {
    return null;
  }

  const seriesPosts = sortBlogSeriesPosts(posts.filter((candidate) => candidate.data.series === series));

  if (seriesPosts.length < 2) {
    return null;
  }

  const currentIndex = seriesPosts.findIndex((candidate) => candidate.id === post.id);

  if (currentIndex === -1) {
    return null;
  }

  return {
    title: post.data.seriesTitle ?? formatSeriesTitle(series),
    current: currentIndex + 1,
    total: seriesPosts.length,
    previousPost: seriesPosts[currentIndex - 1] ?? null,
    nextPost: seriesPosts[currentIndex + 1] ?? null,
  };
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

export const getBlogPath = (post: CollectionEntry<'blog'>) => `/blog/${post.id.replace(/\.md$/, '')}`;
