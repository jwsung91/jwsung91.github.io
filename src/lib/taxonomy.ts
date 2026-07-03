import taxonomyData from '../data/taxonomy.json';

export type SeriesMeta = {
  id: string;
  title: string;
  project?: string;
  description: string;
};

type Taxonomy = {
  projects: { id: string; label: string }[];
  kinds: { id: string; label: string }[];
  series: SeriesMeta[];
};

const taxonomy = taxonomyData as Taxonomy;

export const projectIds = taxonomy.projects.map((p) => p.id) as [
  string,
  ...string[],
];
export const kindIds = taxonomy.kinds.map((k) => k.id) as [string, ...string[]];
export const seriesIds = taxonomy.series.map((s) => s.id) as [
  string,
  ...string[],
];

export const projectLabels: Record<string, string> = Object.fromEntries(
  taxonomy.projects.map((p) => [p.id, p.label]),
);

export const kindLabels: Record<string, string> = Object.fromEntries(
  taxonomy.kinds.map((k) => [k.id, k.label]),
);

export const seriesList: SeriesMeta[] = taxonomy.series;

export const getSeriesMeta = (series: string) =>
  seriesList.find((s) => s.id === series);
