import matter from 'gray-matter';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
import path from 'node:path';

const files = await fg('src/content/blog/**/*.md', {
  dot: false,
  onlyFiles: true,
});

const allowedProjects = new Set(['unilink', 'ai-curator', 'site']);
const allowedKinds = new Set([
  'design',
  'implementation',
  'release',
  'retrospective',
  'study',
  'note',
]);
const allowedTopics = new Set([
  'cpp',
  'ros2',
  'system-design',
  'tooling',
  'cms-site',
]);
const seriesMeta = {
  'unilink-design': {
    project: 'unilink',
  },
  'ai-curator-pipeline': {
    project: 'ai-curator',
  },
  'cpp-stl-study': {
    topic: 'cpp',
  },
};

let hasError = false;
const seriesOrders = new Map();

function fail(file, message) {
  hasError = true;
  console.error(`✖ ${file}: ${message}`);
}

function normalizeDate(value) {
  if (!value) return '';

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
}

for (const file of files) {
  const raw = await fs.readFile(file, 'utf8');
  const { data, content } = matter(raw);
  const basename = path.basename(file);

  const filenameDate = basename.match(/^(\d{4}-\d{2}-\d{2})-/)?.[1];
  const frontmatterDate = normalizeDate(data.date);

  if (!filenameDate) {
    fail(file, '파일명이 YYYY-MM-DD-... 형식이 아닙니다.');
  }

  if (!frontmatterDate) {
    fail(file, 'frontmatter date가 없습니다.');
  }

  if (filenameDate && frontmatterDate && filenameDate !== frontmatterDate) {
    fail(
      file,
      `파일명 날짜(${filenameDate})와 frontmatter date(${frontmatterDate})가 다릅니다.`,
    );
  }

  if (!data.title || typeof data.title !== 'string') {
    fail(file, 'title이 없습니다.');
  }

  if ('category' in data) {
    fail(
      file,
      'category field는 더 이상 사용하지 않습니다. kind를 사용하세요.',
    );
  }

  if (!allowedKinds.has(data.kind)) {
    fail(file, `kind가 올바르지 않습니다: ${data.kind}`);
  }

  if (data.project && !allowedProjects.has(data.project)) {
    fail(file, `project가 올바르지 않습니다: ${data.project}`);
  }

  if (!data.project && data.kind === 'study' && !data.topic) {
    fail(file, '프로젝트 없는 study 글은 topic이 필요합니다.');
  }

  if (data.topic && !allowedTopics.has(data.topic)) {
    fail(file, `topic이 올바르지 않습니다: ${data.topic}`);
  }

  if (
    !data.description ||
    typeof data.description !== 'string' ||
    data.description.length < 40 ||
    data.description.length > 180
  ) {
    fail(file, 'description은 40~180자 문자열이어야 합니다.');
  }

  if (!Array.isArray(data.tags)) {
    fail(file, 'tags는 배열이어야 합니다.');
  } else {
    const seenTags = new Set();

    for (const rawTag of data.tags) {
      const tag = typeof rawTag === 'string' ? rawTag.trim() : '';

      if (!tag) {
        fail(file, 'tags에 빈 값이 있습니다.');
        continue;
      }

      const normalized = tag.toLowerCase();

      if (seenTags.has(normalized)) {
        fail(file, `중복 tag가 있습니다: ${tag}`);
      }

      seenTags.add(normalized);
    }
  }

  if (data.series) {
    if (!Number.isInteger(data.seriesOrder)) {
      fail(file, 'series가 있으면 정수 seriesOrder가 필요합니다.');
    } else {
      const key = `${data.series}:${data.seriesOrder}`;

      if (seriesOrders.has(key)) {
        fail(
          file,
          `seriesOrder가 중복됩니다. 이미 사용한 파일: ${seriesOrders.get(key)}`,
        );
      }

      seriesOrders.set(key, file);
    }

    const meta = seriesMeta[data.series];

    if (!meta) {
      fail(file, `series가 올바르지 않습니다: ${data.series}`);
    }

    if (meta?.project && data.project !== meta.project) {
      fail(
        file,
        `series ${data.series}는 project ${meta.project}와 함께 사용해야 합니다.`,
      );
    }

    if (meta?.topic && data.topic !== meta.topic) {
      fail(
        file,
        `series ${data.series}는 topic ${meta.topic}와 함께 사용해야 합니다.`,
      );
    }
  }

  if (!data.series && data.seriesOrder !== undefined) {
    fail(file, 'seriesOrder는 series가 있을 때만 사용할 수 있습니다.');
  }

  if (content.includes('{: .prompt-')) {
    fail(file, 'Jekyll 스타일 prompt class 잔여물이 있습니다.');
  }

  if (/```mermaid[^\S\r\n]+\S/.test(content)) {
    fail(file, 'Mermaid fence는 ```mermaid 다음 줄부터 작성해야 합니다.');
  }

  for (const match of content.matchAll(/```mermaid\n([\s\S]*?)\n```/g)) {
    if (match[1].includes('\t')) {
      fail(file, 'Mermaid block에는 tab 대신 space를 사용하세요.');
    }
  }
}

if (hasError) {
  process.exit(1);
}

console.log(`✓ ${files.length} markdown files checked`);
