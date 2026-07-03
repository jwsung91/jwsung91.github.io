import rss from '@astrojs/rss';
import { getBlogPath, getPublishedBlogPosts } from '../lib/blog';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getPublishedBlogPosts();

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
