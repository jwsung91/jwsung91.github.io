import type { CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;

export const getProjectSlug = (project: ProjectEntry) =>
  project.id.replace(/\.md$/, '');

export const getProjectPath = (project: ProjectEntry | string) =>
  `/projects/${typeof project === 'string' ? project : getProjectSlug(project)}/`;

export const sortProjects = (projects: ProjectEntry[]) =>
  [...projects].sort((a, b) => a.data.order - b.data.order);
