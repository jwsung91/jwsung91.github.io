import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { sortBlogPosts, getBlogPath } from '../lib/blog';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = sortBlogPosts(
    await getCollection('blog', ({ data }) => !data.draft),
  );

  return rss({
    title: 'jwsung91',
    description:
      'Robotics Software Architect — platform architecture, middleware.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: getBlogPath(post),
    })),
  });
}
