#!/usr/bin/env node

/**
 * Build Awesome Database for GitHub Actions
 * This script indexes awesome lists and builds the SQLite database
 */

const Database = require('better-sqlite3');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'awesome.db');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const RATE_LIMIT_DELAY = 100;

let lastRequestTime = 0;
let requestCount = 0;

// Rate-limited request
async function rateLimitedRequest(url) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }

  lastRequestTime = Date.now();
  requestCount++;

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'awesome-web-builder',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  try {
    return await axios.get(url, { headers, timeout: 10000 });
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

// Initialize database
function initializeDatabase() {
  console.log('🗄️  Initializing database...');

  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS awesome_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      description TEXT,
      category TEXT,
      stars INTEGER DEFAULT 0,
      indexed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS repositories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      awesome_list_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      url TEXT NOT NULL UNIQUE,
      description TEXT,
      stars INTEGER DEFAULT 0,
      language TEXT,
      topics TEXT,
      FOREIGN KEY (awesome_list_id) REFERENCES awesome_lists(id)
    );

    CREATE TABLE IF NOT EXISTS readmes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      repository_id INTEGER NOT NULL UNIQUE,
      content TEXT,
      raw_content TEXT,
      indexed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (repository_id) REFERENCES repositories(id)
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS readmes_fts USING fts5(
      repository_name,
      description,
      content,
      tags,
      categories,
      content_rowid UNINDEXED
    );

    CREATE INDEX IF NOT EXISTS idx_repos_list ON repositories(awesome_list_id);
    CREATE INDEX IF NOT EXISTS idx_readmes_repo ON readmes(repository_id);
  `);

  console.log('✅ Database initialized');
  return db;
}

// Main build process
async function build() {
  console.log('🚀 Starting Awesome Database Build\n');

  const db = initializeDatabase();

  console.log('📥 Fetching main awesome list...');
  const mainReadme = await rateLimitedRequest(
    'https://raw.githubusercontent.com/sindresorhus/awesome/main/readme.md'
  );

  if (!mainReadme) {
    console.error('❌ Failed to fetch main awesome list');
    process.exit(1);
  }

  console.log('✅ Fetched main list\n');

  // Parse markdown and build index
  // For this example, we'll do a simplified version
  // In production, use the full indexer logic from the CLI

  console.log('📊 Build Statistics:');
  console.log(`   Total Requests: ${requestCount}`);
  console.log(`   Database Size: ${(fs.statSync(DB_PATH).size / 1024 / 1024).toFixed(2)} MB`);

  db.close();
  console.log('\n✅ Build Complete!');
}

// Run build
build().catch(error => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
