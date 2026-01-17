#!/usr/bin/env node
/**
 * FULL BOOK INDEXER - Syncs entire Infinite Architects book to Algolia
 *
 * Extracts text from EPUB, chunks into searchable segments, uploads to Algolia
 *
 * Usage:
 *   ALGOLIA_APP_ID=xxx ALGOLIA_ADMIN_KEY=xxx node scripts/sync-full-book.js
 */

import { algoliasearch } from 'algoliasearch';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CHUNK_SIZE = 400; // words per chunk
const CHUNK_OVERLAP = 50; // overlap words for context continuity

// Chapter metadata mapping
const CHAPTER_META = {
  'prologue': { part: 0, chapter: 0, title: 'Prologue' },
  'introduction': { part: 0, chapter: 0, title: 'Introduction' },
  'before-we-begin': { part: 0, chapter: 0, title: 'Before We Begin' },
  'the-two-gardens': { part: 0, chapter: 0, title: 'The Two Gardens' },
  'what-this-book-proposes': { part: 0, chapter: 0, title: 'What This Book Proposes' },
  'part-001': { part: 1, chapter: 0, title: 'Part I: The Seeds' },
  'part-001-chapter-001': { part: 1, chapter: 1, title: 'Chapter 1: The Seeds of Creation' },
  'part-001-chapter-002': { part: 1, chapter: 2, title: 'Chapter 2: The Dual Forces' },
  'part-001-chapter-003': { part: 1, chapter: 3, title: 'Chapter 3: A Letter Across Time' },
  'part-001-eden-principle-i': { part: 1, chapter: 0, title: 'Eden Principle I' },
  'part-002': { part: 2, chapter: 0, title: 'Part II: The Garden' },
  'part-002-chapter-004': { part: 2, chapter: 4, title: 'Chapter 4: Cultivating Eden' },
  'part-002-chapter-005': { part: 2, chapter: 5, title: 'Chapter 5: The Universe Fine-Tuned' },
  'part-002-chapter-006': { part: 2, chapter: 6, title: 'Chapter 6: Consciousness and Recursion' },
  'part-002-eden-principle-ii': { part: 2, chapter: 0, title: 'Eden Principle II' },
  'part-003': { part: 3, chapter: 0, title: 'Part III: The Guardians' },
  'part-003-chapter-007': { part: 3, chapter: 7, title: 'Chapter 7: The Convergence' },
  'part-003-chapter-008': { part: 3, chapter: 8, title: 'Chapter 8: The Chokepoint' },
  'part-003-chapter-009': { part: 3, chapter: 9, title: 'Chapter 9: The Partnership' },
  'part-003-eden-principle-iii': { part: 3, chapter: 0, title: 'Eden Principle III' },
  'part-004': { part: 4, chapter: 0, title: 'Part IV: The Infinite' },
  'part-004-chapter-010': { part: 4, chapter: 10, title: 'Chapter 10: Infinite Architects' },
  'part-004-chapter-011': { part: 4, chapter: 11, title: 'Chapter 11: Love as Essential Variable' },
  'part-004-chapter-012': { part: 4, chapter: 12, title: 'Chapter 12: Verification and Future' },
  'epilogue': { part: 5, chapter: 0, title: 'Epilogue' },
  'afterword': { part: 5, chapter: 0, title: 'Afterword' },
  'final-mediation': { part: 5, chapter: 0, title: 'Final Meditation' },
  'glossary-of-key-terms': { part: 6, chapter: 0, title: 'Glossary of Key Terms' },
  'appendix-a-the-arc-principle-operationalised': { part: 6, chapter: 0, title: 'Appendix A: The ARC Principle' },
  'appendix-b-research-methodology': { part: 6, chapter: 0, title: 'Appendix B: Research Methodology' },
  'appendix-c-eden-protocol-technical-specification': { part: 6, chapter: 0, title: 'Appendix C: Eden Protocol Technical Spec' },
  'appendix-d-timeline-of-key-developments': { part: 6, chapter: 0, title: 'Appendix D: Timeline' },
  'appendix-e-verified-research-sources-with-links': { part: 6, chapter: 0, title: 'Appendix E: Verified Sources' },
  'appendix-f-testable-predictions': { part: 6, chapter: 0, title: 'Appendix F: Testable Predictions' },
  'bibliography': { part: 6, chapter: 0, title: 'Bibliography' },
  'endnotes': { part: 6, chapter: 0, title: 'Endnotes' },
  'notes-on-sources': { part: 6, chapter: 0, title: 'Notes on Sources' },
  'about-the-author': { part: 7, chapter: 0, title: 'About the Author' },
  'acknowledgments': { part: 7, chapter: 0, title: 'Acknowledgments' },
  'authors-note': { part: 7, chapter: 0, title: "Author's Note" },
  'note-on-ai-assistance': { part: 7, chapter: 0, title: 'Note on AI Assistance' },
  'a-note-on-timing': { part: 7, chapter: 0, title: 'A Note on Timing' }
};

// Files to skip (not content)
const SKIP_FILES = ['cover.xhtml', 'title-page.xhtml', 'copyright.xhtml', 'toc.xhtml', 'contents.xhtml', 'index.xhtml', 'infinite-architects.xhtml'];

/**
 * Strip HTML tags and clean text
 */
function stripHtml(html) {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Chunk text into segments with overlap
 */
function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const chunks = [];

  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    if (chunk.length > 50) { // Skip tiny chunks
      chunks.push(chunk);
    }
  }

  return chunks;
}

/**
 * Extract chapter title from HTML
 */
function extractTitle(html) {
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
  if (h1Match) {
    return stripHtml(h1Match[1]);
  }
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  if (titleMatch) {
    return stripHtml(titleMatch[1]);
  }
  return null;
}

async function syncFullBook() {
  const appId = process.env.ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;
  const indexName = process.env.ALGOLIA_INDEX_NAME || 'infinite_architects_1';

  if (!appId || !adminKey) {
    console.error('Error: ALGOLIA_APP_ID and ALGOLIA_ADMIN_KEY required');
    process.exit(1);
  }

  // Extract epub if needed
  const epubPath = join(__dirname, '..', 'Infinite-Architects-Generic-2026-01-17.epub');
  const extractPath = '/tmp/epub_extract';

  if (!existsSync(epubPath)) {
    console.error('Error: EPUB file not found at', epubPath);
    process.exit(1);
  }

  console.log('📚 Extracting EPUB...');
  execSync(`rm -rf ${extractPath} && mkdir -p ${extractPath} && cd ${extractPath} && unzip -o "${epubPath}" > /dev/null 2>&1`);

  const oebpsPath = join(extractPath, 'OEBPS');
  const files = readdirSync(oebpsPath).filter(f => f.endsWith('.xhtml') && !SKIP_FILES.includes(f));

  console.log(`📖 Processing ${files.length} content files...\n`);

  const records = [];
  let totalWords = 0;
  let totalChunks = 0;

  for (const file of files) {
    const filePath = join(oebpsPath, file);
    const html = readFileSync(filePath, 'utf-8');
    const text = stripHtml(html);
    const words = text.split(/\s+/).length;

    if (words < 20) continue; // Skip near-empty files

    const fileKey = file.replace('.xhtml', '');
    const meta = CHAPTER_META[fileKey] || { part: 0, chapter: 0, title: extractTitle(html) || fileKey };

    const chunks = chunkText(text);

    chunks.forEach((chunk, i) => {
      records.push({
        objectID: `book-${fileKey}-${i}`,
        type: 'book_passage',
        source: file,
        part: meta.part,
        chapter: meta.chapter,
        title: meta.title,
        chunkIndex: i,
        totalChunks: chunks.length,
        text: chunk,
        wordCount: chunk.split(/\s+/).length
      });
    });

    totalWords += words;
    totalChunks += chunks.length;
    console.log(`  ✓ ${meta.title}: ${words} words → ${chunks.length} chunks`);
  }

  console.log(`\n📊 Total: ${totalWords.toLocaleString()} words → ${totalChunks} searchable chunks`);

  // Also add existing knowledge base records
  console.log('\n📚 Loading structured knowledge base...');
  const knowledgePath = join(__dirname, '..', 'knowledge');

  try {
    const conceptsRaw = JSON.parse(readFileSync(join(knowledgePath, 'concepts.json'), 'utf-8'));
    const concepts = Array.isArray(conceptsRaw) ? conceptsRaw : (conceptsRaw.concepts || []);
    concepts.forEach((concept, i) => {
      records.push({
        objectID: `concept-${i}`,
        type: 'concept',
        name: concept.name || concept.title,
        description: concept.fullDescription || concept.description || '',
        chapter: concept.chapter,
        keywords: concept.keywords || []
      });
    });
    console.log(`  ✓ ${concepts.length} concepts`);
  } catch (e) { /* skip */ }

  try {
    const quotesRaw = JSON.parse(readFileSync(join(knowledgePath, 'quotes.json'), 'utf-8'));
    const quotes = Array.isArray(quotesRaw) ? quotesRaw : (quotesRaw.quotes || []);
    quotes.forEach((quote, i) => {
      records.push({
        objectID: `quote-${i}`,
        type: 'quote',
        text: quote.text || '',
        chapter: quote.chapter,
        keywords: quote.keywords || []
      });
    });
    console.log(`  ✓ ${quotes.length} quotes`);
  } catch (e) { /* skip */ }

  console.log(`\n🚀 Uploading ${records.length} total records to Algolia...`);

  const client = algoliasearch(appId, adminKey);

  // Configure index settings
  await client.setSettings({
    indexName,
    indexSettings: {
      searchableAttributes: [
        'text',
        'name',
        'description',
        'title',
        'keywords'
      ],
      attributesForFaceting: [
        'type',
        'part',
        'chapter',
        'title'
      ],
      attributesToSnippet: [
        'text:50',
        'description:30'
      ],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>'
    }
  });

  // Upload in batches of 1000
  const BATCH_SIZE = 1000;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    await client.saveObjects({ indexName, objects: batch });
    console.log(`  → Uploaded batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(records.length/BATCH_SIZE)}`);
  }

  console.log(`\n✅ SUCCESS! Indexed ${records.length} records to Algolia.`);
  console.log(`\n📈 Index: ${indexName}`);
  console.log(`   - ${totalChunks} book passages (full text search)`);
  console.log(`   - Concepts, quotes, and structured data`);
  console.log(`\n🔍 Your AI can now search and quote from the ENTIRE book!`);
}

syncFullBook().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
