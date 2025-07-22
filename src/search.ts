import fs from 'fs';
import Fuse from 'fuse.js';
import path from 'path';
import { DocumentEntry } from './types';

let fuse: Fuse<DocumentEntry>;
let indexedDocs: DocumentEntry[] = [];

export function loadIndex(): number {
  const raw = fs.readFileSync(path.resolve('data/index.json'), 'utf-8');
  const docs: DocumentEntry[] = JSON.parse(raw);
  indexedDocs = docs;

  fuse = new Fuse(docs, {
    keys: ['content'],
    includeMatches: true,
    includeScore: true,
    threshold: 0.3, // 0 = exact, 1 = very fuzzy
  });

  return docs.length;
}

export function searchDocs(query: string) {
  if (!fuse) throw new Error('Fuse index not loaded');

  const results = fuse.search(query);

  // Group results by file
  const groupedByFile = results.map((r) => ({
    filename: r.item.filename,
    path: r.item.path,
    modified: r.item.modified,
    score: r.score, // lower = better
    snippet: extractContext(r),
  }));

  // Group results by folder
  const groupedByFolder: Record<string, typeof groupedByFile> = {};

  for (const result of groupedByFile) {
    const folderPath = result.path.split('/').slice(0, -1).join('/') || '/';
    if (!groupedByFolder[folderPath]) groupedByFolder[folderPath] = [];
    groupedByFolder[folderPath].push(result);
  }

  return {
    totalMatches: results.length,
    groupedByFile,
    groupedByFolder,
  };
}

// 🔎 Extract snippet where first match occurred (fallback: beginning of file)
function extractContext(result: Fuse.FuseResult<DocumentEntry>, length = 300): string {
  const match = result.matches?.[0];
  const content = result.item.content;

  if (match?.indices?.[0]) {
    const [start] = match.indices[0];
    return content.slice(start, start + length);
  }

  return content.slice(0, length);
}
