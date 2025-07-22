# 🧠 Google Drive Knowledge Base Search

This project is a lightweight internal tool that ingests `.txt` and `.md` files from a Google Drive folder and exposes a simple fuzzy keyword search API. It can be used to build knowledge bases, meeting note searchers, or internal documentation search engines.

---

## 📦 Features

- 🔐 Authenticated access to Google Drive via service account
- 📂 Recursive folder traversal
- 📝 Parses and stores `.txt` and `.md` content with metadata
- 🔍 Full-text and fuzzy search using [Fuse.js](https://fusejs.io)
- 🌐 Minimal REST API: `/search`

---

## 🔧 Setup Instructions

**Clone the repo**

```bash
git clone https://github.com/crupko93/g-drive-kbs.git
cd g-drive-kbs

npm install

mkdir -p creds data

npm run ingest       # One-time 
npm run dev          # Starts Express server on :3000
curl /search?query=meeting
```
## 🧠 KEY TRADE-OFFS

| Decision | Justification |
|---------|----------------|
| JSON vs SQLite | JSON chosen for portability, instant indexing, and easier dev iteration |
| Fuse.js vs DB FTS | Fuse gives scoring + fuzzy matching out of the box |
| Service Account | Avoids OAuth tokens & interactive prompts |
| No UI | Backend only by design, simplifies focus on API logic |

---

## 🚀 POTENTIAL EXTENSIONS

- Add Redis caching for index
- Use SQLite w/ `fts5` virtual tables for full-text search
- Use `bull` or `agenda` for scheduled re-ingestion
- Dockerize with `CMD ["npm", "start"]`
