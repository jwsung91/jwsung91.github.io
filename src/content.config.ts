import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['active', 'archived', 'wip']),
    repo: z.string().url().optional(),
    url: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    order: z.number().default(99),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    updatedAt: z.date().optional(),
    category: z.enum(['devlog', 'study', 'adr', 'note']),
    tags: z.array(z.string()).default([]),
    description: z.string().min(40).max(180),
    series: z.string().optional(),
    seriesTitle: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    draft: z.boolean().default(false),
  }),
});

const now = defineCollection({
  loader: glob({ pattern: 'now.md', base: './src/content' }),
  schema: z.object({
    title: z.string().default('Now'),
    updatedAt: z.string().optional(),
  }),
});

export const collections = { projects, blog, now };
