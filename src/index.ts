import express from 'express';
import dotenv from 'dotenv';
import { loadIndex, searchDocs } from './search';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

let docCount = 0;
try {
  docCount = loadIndex();
  console.log(`📚 Loaded ${docCount} documents into memory`);
} catch (e) {
  console.error('❌ Failed to load index. Run ingest.ts first.');
}

app.get('/search', (req, res) => {
  const query = req.query.query as string;
  if (!query) return res.status(400).send({ error: 'Missing query' });
  try {
    const results = searchDocs(query);
    res.json({ count: results.length, results });
  } catch (err) {
    res.status(500).json({ error: 'Search error', details: err });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
