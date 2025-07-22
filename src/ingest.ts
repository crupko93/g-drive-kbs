import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { getDriveClient } from './drive';
import { DocumentEntry } from './types';

const OUTPUT_PATH = path.resolve('data/index.json');
const ROOT_FOLDER_ID = process.env.ROOT_FOLDER_ID || '';

const drive = getDriveClient();
const documents: DocumentEntry[] = [];


console.log("Starting ingest with folder ID:", ROOT_FOLDER_ID);

async function traverseFolder(folderId: string, currentPath = '') {

  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType, modifiedTime)',
  });

  console.log(`Found ${res.data.files?.length} files:`);


  for (const file of res.data.files || []) {
    const filePath = `${currentPath}/${file.name}`;
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      await traverseFolder(file.id!, filePath);
    } else if (file.name?.endsWith('.txt') || file.name?.endsWith('.md')) {
      const contentRes = await drive.files.get(
        { fileId: file.id!, alt: 'media' },
        { responseType: 'text' }
      );
      documents.push({
        filename: file.name,
        path: filePath,
        modified: file.modifiedTime || '',
        content: contentRes.data as string,
      });
    }
  }
}

(async () => {
  await traverseFolder(ROOT_FOLDER_ID);
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(documents, null, 2));
  console.log(`✅ Ingested ${documents.length} documents`);
})();
