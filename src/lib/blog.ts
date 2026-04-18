import type { CollectionEntry } from 'astro:content';

export const sortBlogPosts = (posts: CollectionEntry<'blog'>[]) =>
  [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day}`;
};

export const getBlogPath = (post: CollectionEntry<'blog'>) => `/blog/${post.id.replace(/\.md$/, '')}`;
