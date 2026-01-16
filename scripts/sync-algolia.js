#!/usr/bin/env node
/**
 * ALGOLIA SYNC SCRIPT - Populates search index
 *
 * Run this script to sync your knowledge base to Algolia:
 * ALGOLIA_APP_ID=xxx ALGOLIA_ADMIN_KEY=xxx node scripts/sync-algolia.js
 *
 * Free tier: 10K records, 10K searches/month
 */

import algoliasearch from 'algoliasearch';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function syncToAlgolia() {
  const appId = process.env.ALGOLIA_APP_ID;
  const adminKey = process.env.ALGOLIA_ADMIN_KEY;
  const indexName = process.env.ALGOLIA_INDEX_NAME || 'infinite_architects';

  if (!appId || !adminKey) {
    console.error('Error: ALGOLIA_APP_ID and ALGOLIA_ADMIN_KEY required');
    console.log('\nUsage:');
    console.log('  ALGOLIA_APP_ID=xxx ALGOLIA_ADMIN_KEY=xxx node scripts/sync-algolia.js');
    process.exit(1);
  }

  console.log('Loading knowledge base...');

  const knowledgePath = join(__dirname, '..', 'knowledge');
  const records = [];

  // Load concepts
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
        keywords: concept.keywords || [],
        epistemicStatus: concept.epistemicStatus || 'NOVEL PROPOSAL'
      });
    });
    console.log(`  - Loaded ${concepts.length} concepts`);
  } catch (e) {
    console.warn('  - Could not load concepts:', e.message);
  }

  // Load chapters
  try {
    const chaptersRaw = JSON.parse(readFileSync(join(knowledgePath, 'chapters.json'), 'utf-8'));
    const chapters = Array.isArray(chaptersRaw) ? chaptersRaw : (chaptersRaw.chapters || []);

    chapters.forEach((chapter, i) => {
      records.push({
        objectID: `chapter-${i}`,
        type: 'chapter',
        name: `Chapter ${chapter.number}: ${chapter.title}`,
        description: chapter.summary || '',
        chapter: chapter.number,
        keyConcepts: chapter.keyConcepts || []
      });
    });
    console.log(`  - Loaded ${chapters.length} chapters`);
  } catch (e) {
    console.warn('  - Could not load chapters:', e.message);
  }

  // Load quotes
  try {
    const quotesRaw = JSON.parse(readFileSync(join(knowledgePath, 'quotes.json'), 'utf-8'));
    const quotes = Array.isArray(quotesRaw) ? quotesRaw : (quotesRaw.quotes || []);

    quotes.forEach((quote, i) => {
      records.push({
        objectID: `quote-${i}`,
        type: 'quote',
        name: quote.text?.slice(0, 100) + (quote.text?.length > 100 ? '...' : ''),
        description: quote.text || '',
        chapter: quote.chapter,
        keywords: quote.keywords || []
      });
    });
    console.log(`  - Loaded ${quotes.length} quotes`);
  } catch (e) {
    console.warn('  - Could not load quotes:', e.message);
  }

  // Load FAQ
  try {
    const faqRaw = JSON.parse(readFileSync(join(knowledgePath, 'faq.json'), 'utf-8'));
    const faqs = faqRaw.faqs || [];

    faqs.forEach((faq, i) => {
      records.push({
        objectID: `faq-${i}`,
        type: 'faq',
        name: faq.question,
        description: faq.answer?.slice(0, 300) + (faq.answer?.length > 300 ? '...' : ''),
        chapter: faq.chapter,
        keywords: faq.patterns || []
      });
    });
    console.log(`  - Loaded ${faqs.length} FAQs`);
  } catch (e) {
    console.warn('  - Could not load FAQs:', e.message);
  }

  console.log(`\nTotal records: ${records.length}`);

  if (records.length === 0) {
    console.error('No records to sync!');
    process.exit(1);
  }

  console.log(`\nSyncing to Algolia index: ${indexName}...`);

  const client = algoliasearch(appId, adminKey);
  const index = client.initIndex(indexName);

  // Configure index settings
  await index.setSettings({
    searchableAttributes: [
      'name',
      'description',
      'keywords'
    ],
    attributesForFaceting: [
      'type',
      'chapter',
      'epistemicStatus'
    ],
    customRanking: [
      'desc(type=concept)',
      'desc(type=chapter)',
      'desc(type=quote)'
    ],
    highlightPreTag: '<mark>',
    highlightPostTag: '</mark>'
  });

  // Upload records
  const { objectIDs } = await index.saveObjects(records);

  console.log(`\nSuccess! Synced ${objectIDs.length} records to Algolia.`);
  console.log('\nYour search index is ready. Add these to Vercel:');
  console.log(`  ALGOLIA_APP_ID=${appId}`);
  console.log(`  ALGOLIA_SEARCH_KEY=<your-search-only-key>`);
  console.log(`  ALGOLIA_INDEX_NAME=${indexName}`);
}

syncToAlgolia().catch(console.error);
