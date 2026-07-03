import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { kindIds, projectIds, seriesIds } from './lib/taxonomy';

const emptyToUndefined = (value: unknown) =>
  value === '' || value === null ? undefined : value;

const optionalDate = z.preprocess(emptyToUndefined, z.coerce.date().optional());

const optionalPositiveInt = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  return Number(value);
}, z.number().int().positive().optional());

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
  schema: z
    .object({
      title: z.string().min(1),
      date: z.coerce.date(),
      updatedAt: optionalDate,
      project: z.preprocess(emptyToUndefined, z.enum(projectIds).optional()),
      kind: z.enum(kindIds),

      tags: z.array(z.string()).default([]),
      description: z.string().min(40).max(180),
      series: z.preprocess(emptyToUndefined, z.enum(seriesIds).optional()),
      seriesOrder: optionalPositiveInt,
      draft: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
      if (data.series && data.seriesOrder === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['seriesOrder'],
          message: 'series가 있으면 seriesOrder도 필요합니다.',
        });
      }

      if (!data.series && data.seriesOrder !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['seriesOrder'],
          message: 'seriesOrder는 series가 있을 때만 사용할 수 있습니다.',
        });
      }
    }),
});

const now = defineCollection({
  loader: glob({ pattern: 'now.md', base: './src/content' }),
  schema: z.object({
    title: z.string().default('Now'),
    updatedAt: optionalDate,
  }),
});

const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content' }),
  schema: z.object({
    title: z.string().default('About'),
  }),
});

export const collections = { projects, blog, now, about };
