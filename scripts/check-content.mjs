import matter from 'gray-matter';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';

const files = await fg('src/content/blog/**/*.md', {
  dot: false,
  onlyFiles: true,
});

const taxonomy = JSON.parse(
  await fs.readFile('src/data/taxonomy.json', 'utf8'),
);

const allowedKinds = new Set(taxonomy.kinds.map((k) => k.id));
const allowedProjects = new Set(taxonomy.projects.map((p) => p.id));
const seriesMeta = Object.fromEntries(
  taxonomy.series.map((s) => [s.id, { project: s.project }]),
);

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

const isFix = process.argv.includes('--fix');

for (const file of files) {
  let currentFile = file;
  let raw = await fs.readFile(currentFile, 'utf8');
  const { data, content } = matter(raw);
  let basename = path.basename(currentFile);

  const filenameDate = basename.match(/^(\d{4}-\d{2}-\d{2})-/)?.[1];
  const frontmatterDate = normalizeDate(data.date);

  if (!filenameDate) {
    if (isFix && frontmatterDate) {
      const newBasename = `${frontmatterDate}-${basename}`;
      const newFile = path.join(path.dirname(currentFile), newBasename);
      await fs.rename(currentFile, newFile);
      console.log(
        `✓ Renamed (added date prefix): ${currentFile} -> ${newFile}`,
      );
      currentFile = newFile;
      basename = newBasename;
    } else {
      fail(currentFile, '파일명이 YYYY-MM-DD-... 형식이 아닙니다.');
    }
  }

  if (!frontmatterDate) {
    fail(currentFile, 'frontmatter date가 없습니다.');
  }

  if (filenameDate && frontmatterDate && filenameDate !== frontmatterDate) {
    if (isFix) {
      const newBasename = basename.replace(
        /^\d{4}-\d{2}-\d{2}-/,
        `${frontmatterDate}-`,
      );
      const newFile = path.join(path.dirname(currentFile), newBasename);
      await fs.rename(currentFile, newFile);
      console.log(`✓ Renamed (matched date): ${currentFile} -> ${newFile}`);
      currentFile = newFile;
      basename = newBasename;
    } else {
      fail(
        currentFile,
        `파일명 날짜(${filenameDate})와 frontmatter date(${frontmatterDate})가 다릅니다.`,
      );
    }
  }

  if (!data.title || typeof data.title !== 'string') {
    fail(currentFile, 'title이 없습니다.');
  }

  if ('category' in data) {
    fail(
      currentFile,
      'category field는 더 이상 사용하지 않습니다. kind를 사용하세요.',
    );
  }

  if ('topic' in data) {
    fail(
      currentFile,
      'topic field는 더 이상 사용하지 않습니다. tags를 사용하세요.',
    );
  }

  if (!allowedKinds.has(data.kind)) {
    fail(currentFile, `kind가 올바르지 않습니다: ${data.kind}`);
  }

  if (
    data.project &&
    (typeof data.project !== 'string' || !/^[a-z0-9-]+$/.test(data.project))
  ) {
    fail(
      currentFile,
      `project는 올바른 슬러그 형식(소문자, 숫자, -)이어야 합니다: ${data.project}`,
    );
  } else if (data.project && !allowedProjects.has(data.project)) {
    fail(currentFile, `project가 올바르지 않습니다: ${data.project}`);
  }

  if (
    !data.description ||
    typeof data.description !== 'string' ||
    data.description.length < 40 ||
    data.description.length > 180
  ) {
    fail(currentFile, 'description은 40~180자 문자열이어야 합니다.');
  }

  if (!Array.isArray(data.tags)) {
    fail(currentFile, 'tags는 배열이어야 합니다.');
  } else {
    const seenTags = new Set();

    for (const rawTag of data.tags) {
      const tag = typeof rawTag === 'string' ? rawTag.trim() : '';

      if (!tag) {
        fail(currentFile, 'tags에 빈 값이 있습니다.');
        continue;
      }

      const normalized = tag.toLowerCase();

      if (seenTags.has(normalized)) {
        fail(currentFile, `중복 tag가 있습니다: ${tag}`);
      }

      seenTags.add(normalized);
    }
  }

  if (data.series) {
    if (!Number.isInteger(data.seriesOrder)) {
      fail(currentFile, 'series가 있으면 정수 seriesOrder가 필요합니다.');
    } else {
      const key = `${data.series}:${data.seriesOrder}`;

      if (seriesOrders.has(key)) {
        fail(
          currentFile,
          `seriesOrder가 중복됩니다. 이미 사용한 파일: ${seriesOrders.get(key)}`,
        );
      }

      seriesOrders.set(key, currentFile);
    }

    const meta = seriesMeta[data.series];

    if (!meta) {
      fail(currentFile, `series가 올바르지 않습니다: ${data.series}`);
    }

    if (meta?.project && data.project !== meta.project) {
      fail(
        currentFile,
        `series ${data.series}는 project ${meta.project}와 함께 사용해야 합니다.`,
      );
    }
  }

  if (!data.series && data.seriesOrder !== undefined) {
    fail(currentFile, 'seriesOrder는 series가 있을 때만 사용할 수 있습니다.');
  }

  if (content.includes('{: .prompt-')) {
    fail(currentFile, 'Jekyll 스타일 prompt class 잔여물이 있습니다.');
  }

  let updatedContent = content;
  let contentChanged = false;

  if (/```mermaid[^\S\r\n]+\S/.test(content)) {
    if (isFix) {
      updatedContent = updatedContent.replace(
        /(```mermaid)([^\S\r\n]+\S)/g,
        '$1\n$2',
      );
      contentChanged = true;
      console.log(`✓ Fixed mermaid fence in ${currentFile}`);
    } else {
      fail(
        currentFile,
        'Mermaid fence는 ```mermaid 다음 줄부터 작성해야 합니다.',
      );
    }
  }

  let hasTabInMermaid = false;
  for (const match of updatedContent.matchAll(/```mermaid\n([\s\S]*?)\n```/g)) {
    if (match[1].includes('\t')) {
      hasTabInMermaid = true;
      break;
    }
  }

  if (hasTabInMermaid) {
    if (isFix) {
      updatedContent = updatedContent.replace(
        /```mermaid\n([\s\S]*?)\n```/g,
        (match, p1) => {
          return '```mermaid\n' + p1.replace(/\t/g, '  ') + '\n```';
        },
      );
      contentChanged = true;
      console.log(`✓ Fixed tabs in mermaid block in ${currentFile}`);
    } else {
      fail(currentFile, 'Mermaid block에는 tab 대신 space를 사용하세요.');
    }
  }

  if (contentChanged) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (match) {
      const frontmatter = match[1];
      const newRaw = `---\n${frontmatter}\n---\n${updatedContent}`;
      await fs.writeFile(currentFile, newRaw, 'utf8');
    } else {
      const stringified = matter.stringify(updatedContent, data);
      await fs.writeFile(currentFile, stringified, 'utf8');
    }
  }
}

function checkCmsFieldOptions(fields, fieldName, expectedIds, label) {
  const field = fields.find((f) => f.name === fieldName);

  if (!field || !Array.isArray(field.options)) {
    fail(
      'public/admin/config.yml',
      `blog collection에서 ${fieldName} select field를 찾을 수 없습니다.`,
    );
    return;
  }

  const cmsIds = new Set(field.options.map((option) => option.value));
  const expected = new Set(expectedIds);

  const missingInCms = [...expected].filter((id) => !cmsIds.has(id));
  const extraInCms = [...cmsIds].filter((id) => !expected.has(id));

  if (missingInCms.length > 0) {
    fail(
      'public/admin/config.yml',
      `${label}에 taxonomy에는 있지만 CMS에 없는 값이 있습니다: ${missingInCms.join(', ')}`,
    );
  }

  if (extraInCms.length > 0) {
    fail(
      'public/admin/config.yml',
      `${label}에 CMS에는 있지만 taxonomy에 없는 값이 있습니다: ${extraInCms.join(', ')}`,
    );
  }
}

const cmsConfig = parseYaml(
  await fs.readFile('public/admin/config.yml', 'utf8'),
);
const blogCollection = cmsConfig.collections.find((c) => c.name === 'blog');

if (!blogCollection) {
  fail('public/admin/config.yml', 'blog collection을 찾을 수 없습니다.');
} else {
  checkCmsFieldOptions(
    blogCollection.fields,
    'project',
    taxonomy.projects.map((p) => p.id),
    'project options',
  );
  checkCmsFieldOptions(
    blogCollection.fields,
    'kind',
    taxonomy.kinds.map((k) => k.id),
    'kind options',
  );
  checkCmsFieldOptions(
    blogCollection.fields,
    'series',
    taxonomy.series.map((s) => s.id),
    'series options',
  );
}

if (hasError) {
  process.exit(1);
}

console.log(`✓ ${files.length} markdown files checked`);
