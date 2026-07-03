import type { CollectionEntry } from 'astro:content';
import {
  getSeriesMeta,
  kindLabels,
  projectIds,
  projectLabels,
  seriesList,
} from './taxonomy';

export type BlogPost = CollectionEntry<'blog'>;
export type BlogProject = (typeof projectIds)[number];
export type BlogKind = string;

export type BlogTagSummary = {
  tag: string;
  slug: string;
  count: number;
};

export { projectLabels, kindLabels };

const tagDisplayLabels: Record<string, string> = {
  'ai-curator': 'AI Curator',
};

export const sortBlogPosts = (posts: BlogPost[]) =>
  [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const sortBlogSeriesPosts = (posts: BlogPost[]) =>
  [...posts].sort((a, b) => {
    const orderA = a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.data.date.getTime() - b.data.date.getTime();
  });

export const groupBlogPostsBySeries = (posts: BlogPost[]) => {
  const groups = new Map<string, BlogPost[]>();

  posts.forEach((post) => {
    if (!post.data.series) {
      return;
    }

    groups.set(post.data.series, [
      ...(groups.get(post.data.series) ?? []),
      post,
    ]);
  });

  return groups;
};

export const getFeaturedBlogSeries = (posts: CollectionEntry<'blog'>[]) => {
  const groupedPosts = groupBlogPostsBySeries(posts);

  return seriesList
    .map((meta) => {
      const seriesPosts = sortBlogSeriesPosts(groupedPosts.get(meta.id) ?? []);
      const firstPost = seriesPosts[0];

      if (!firstPost) {
        return null;
      }

      return {
        series: meta.id,
        ...meta,
        posts: seriesPosts,
        firstPost,
      };
    })
    .filter((series): series is NonNullable<typeof series> => series !== null);
};

export const slugifyBlogFilterValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replaceAll('&', ' and ')
    .replaceAll('+', ' plus ')
    .replace(/[^a-z0-9가-힣]+/gi, '-')
    .replace(/^-+|-+$/g, '');

export const getTagPath = (tag: string) =>
  `/blog/tags/${slugifyBlogFilterValue(tag)}/`;

export const getBlogTagSummaries = (posts: BlogPost[]) => {
  const tags = new Map<string, BlogTagSummary>();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => {
      const slug = slugifyBlogFilterValue(tag);

      if (!slug) {
        return;
      }

      const existing = tags.get(slug);
      const displayTag = tagDisplayLabels[slug] ?? tag;

      tags.set(slug, {
        tag: existing?.tag ?? displayTag,
        slug,
        count: (existing?.count ?? 0) + 1,
      });
    });
  });

  return [...tags.values()].sort((a, b) => {
    if (a.count !== b.count) {
      return b.count - a.count;
    }

    return a.tag.localeCompare(b.tag);
  });
};

export const filterPostsByTagSlug = (posts: BlogPost[], tagSlug: string) =>
  posts.filter((post) =>
    post.data.tags.some((tag) => slugifyBlogFilterValue(tag) === tagSlug),
  );

export const getStudyPosts = (posts: BlogPost[]) =>
  posts.filter((post) => post.data.kind === 'study');

export const getNotePosts = (posts: BlogPost[]) =>
  posts.filter((post) => post.data.kind === 'note');

export const getProjectPosts = (posts: BlogPost[], project: BlogProject) =>
  posts.filter((post) => post.data.project === project);

export const getSitePosts = (posts: BlogPost[]) =>
  posts.filter((post) => post.data.project === 'site');

export const groupPostsByProject = (posts: BlogPost[]) => {
  const groups = new Map<BlogProject, BlogPost[]>();

  posts.forEach((post) => {
    if (!post.data.project) {
      return;
    }

    groups.set(post.data.project, [
      ...(groups.get(post.data.project) ?? []),
      post,
    ]);
  });

  return groups;
};

export const formatSeriesTitle = (series: string) =>
  series
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const getBlogSeriesNav = (
  post: CollectionEntry<'blog'>,
  posts: CollectionEntry<'blog'>[],
) => {
  const series = post.data.series;

  if (!series) {
    return null;
  }

  const seriesPosts = sortBlogSeriesPosts(
    posts.filter((candidate) => candidate.data.series === series),
  );

  if (seriesPosts.length < 2) {
    return null;
  }

  const currentIndex = seriesPosts.findIndex(
    (candidate) => candidate.id === post.id,
  );

  if (currentIndex === -1) {
    return null;
  }

  return {
    title: getSeriesMeta(series)?.title ?? formatSeriesTitle(series),
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

export const getBlogPath = (post: CollectionEntry<'blog'>) =>
  `/blog/${post.id.replace(/\.md$/, '')}`;
