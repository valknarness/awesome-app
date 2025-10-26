#!/usr/bin/env node

/**
 * Build Awesome Database for GitHub Actions
 * This script uses the awesome CLI to either download a pre-built database
 * or build it from scratch using the indexer
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'awesome.db');
const AWESOME_REPO = process.env.AWESOME_REPO || 'valknarness/awesome';
const BUILD_MODE = process.env.BUILD_MODE || 'download'; // 'download' or 'build'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkCommand(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function downloadDatabase() {
  log('\n📥 Downloading pre-built database from GitHub Actions...', 'cyan');

  // Check if gh CLI is installed
  if (!checkCommand('gh')) {
    log('❌ GitHub CLI (gh) is not installed', 'red');
    log('Install from: https://cli.github.com/', 'yellow');
    process.exit(1);
  }

  // Authenticate gh CLI if needed
  try {
    execSync('gh auth status', { stdio: 'ignore' });
  } catch {
    log('⚠️  Not authenticated with GitHub CLI', 'yellow');
    if (GITHUB_TOKEN) {
      log('Using GITHUB_TOKEN from environment...', 'blue');
      process.env.GH_TOKEN = GITHUB_TOKEN;
    } else {
      log('❌ No GitHub authentication available', 'red');
      log('Set GITHUB_TOKEN environment variable or run: gh auth login', 'yellow');
      process.exit(1);
    }
  }

  try {
    // Get latest successful workflow run
    log(`Fetching latest database build from ${AWESOME_REPO}...`, 'blue');

    const runsOutput = execSync(
      `gh api -H "Accept: application/vnd.github+json" "/repos/${AWESOME_REPO}/actions/workflows/build-database.yml/runs?per_page=1&status=success"`,
      { encoding: 'utf-8' }
    );

    const runs = JSON.parse(runsOutput);

    if (!runs.workflow_runs || runs.workflow_runs.length === 0) {
      log('❌ No successful database builds found', 'red');
      log('Falling back to local build...', 'yellow');
      return false;
    }

    const latestRun = runs.workflow_runs[0];
    log(`✓ Found build from ${latestRun.created_at}`, 'green');

    // Get artifacts for this run
    const artifactsOutput = execSync(
      `gh api -H "Accept: application/vnd.github+json" "/repos/${AWESOME_REPO}/actions/runs/${latestRun.id}/artifacts"`,
      { encoding: 'utf-8' }
    );

    const artifacts = JSON.parse(artifactsOutput);
    const dbArtifact = artifacts.artifacts.find(a => a.name.startsWith('awesome-database'));

    if (!dbArtifact) {
      log('❌ No database artifact found in latest run', 'red');
      log('Falling back to local build...', 'yellow');
      return false;
    }

    log(`✓ Found artifact: ${dbArtifact.name} (${(dbArtifact.size_in_bytes / 1024 / 1024).toFixed(1)} MB)`, 'green');

    // Download artifact
    const tempDir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'awesome-db-'));

    log('Downloading artifact...', 'blue');
    execSync(`gh run download ${latestRun.id} -R ${AWESOME_REPO} -D ${tempDir}`, {
      stdio: 'inherit'
    });

    // Find and copy database file
    const files = fs.readdirSync(tempDir, { recursive: true, withFileTypes: true });
    const dbFile = files.find(f => f.isFile() && f.name.endsWith('.db'));

    if (!dbFile) {
      log('❌ Database file not found in artifact', 'red');
      fs.rmSync(tempDir, { recursive: true, force: true });
      return false;
    }

    const dbFilePath = path.join(dbFile.path || tempDir, dbFile.name);
    fs.copyFileSync(dbFilePath, DB_PATH);

    // Copy metadata if available
    const metadataFile = files.find(f => f.isFile() && f.name === 'metadata.json');
    if (metadataFile) {
      const metadataPath = path.join(metadataFile.path || tempDir, metadataFile.name);
      fs.copyFileSync(metadataPath, path.join(process.cwd(), 'db-metadata.json'));
    }

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });

    const size = fs.statSync(DB_PATH).size;
    log(`✓ Database downloaded successfully (${(size / 1024 / 1024).toFixed(2)} MB)`, 'green');

    return true;
  } catch (error) {
    log(`❌ Download failed: ${error.message}`, 'red');
    return false;
  }
}

async function buildDatabaseLocally() {
  log('\n🔨 Building database locally using awesome CLI...', 'cyan');

  // Check if awesome CLI is available
  const awesomePath = path.join(__dirname, '../../awesome/awesome');

  if (!fs.existsSync(awesomePath)) {
    log('❌ Awesome CLI not found at: ' + awesomePath, 'red');
    log('Expected location: /path/to/awesome/awesome', 'yellow');
    log('Please ensure the awesome repository is checked out as a sibling directory', 'yellow');
    process.exit(1);
  }

  try {
    // Ensure awesome CLI is executable
    fs.chmodSync(awesomePath, '755');

    log('Installing awesome CLI dependencies...', 'blue');
    execSync('pnpm install && pnpm rebuild better-sqlite3', {
      cwd: path.dirname(awesomePath),
      stdio: 'inherit'
    });

    // Configure GitHub token if available
    if (GITHUB_TOKEN) {
      log('Configuring GitHub token for API access...', 'blue');
      execSync(`node -e "
        const db = require('./lib/database');
        const dbOps = require('./lib/db-operations');
        db.initialize();
        dbOps.setSetting('githubToken', '${GITHUB_TOKEN}');
        db.close();
      "`, {
        cwd: path.dirname(awesomePath),
        stdio: 'inherit'
      });
    }

    log('Building index (this may take 1-2 hours)...', 'blue');

    // Run indexer with full mode
    const buildProcess = spawn(awesomePath, ['index'], {
      cwd: path.dirname(awesomePath),
      stdio: ['pipe', 'inherit', 'inherit']
    });

    // Automatically select 'full' mode
    buildProcess.stdin.write('full\n');
    buildProcess.stdin.end();

    await new Promise((resolve, reject) => {
      buildProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Build failed with code ${code}`));
        }
      });
      buildProcess.on('error', reject);
    });

    // Copy database to current directory
    const awesomeDbPath = path.join(require('os').homedir(), '.awesome', 'awesome.db');

    if (!fs.existsSync(awesomeDbPath)) {
      throw new Error('Database not created at expected location: ' + awesomeDbPath);
    }

    fs.copyFileSync(awesomeDbPath, DB_PATH);

    const size = fs.statSync(DB_PATH).size;
    log(`✓ Database built successfully (${(size / 1024 / 1024).toFixed(2)} MB)`, 'green');

    return true;
  } catch (error) {
    log(`❌ Build failed: ${error.message}`, 'red');
    return false;
  }
}

async function generateMetadata() {
  log('\n📊 Generating metadata...', 'cyan');

  try {
    const Database = require('better-sqlite3');
    const db = new Database(DB_PATH, { readonly: true });

    const listsCount = db.prepare('SELECT COUNT(*) as count FROM awesome_lists').get().count;
    const reposCount = db.prepare('SELECT COUNT(*) as count FROM repositories').get().count;
    const readmesCount = db.prepare('SELECT COUNT(*) as count FROM readmes').get().count;

    db.close();

    const stats = fs.statSync(DB_PATH);
    const size = (stats.size / 1024 / 1024).toFixed(2);
    const hash = require('crypto')
      .createHash('sha256')
      .update(fs.readFileSync(DB_PATH))
      .digest('hex');

    const metadata = {
      version: process.env.GITHUB_SHA || 'unknown',
      timestamp: new Date().toISOString(),
      size: `${size}MB`,
      hash: hash,
      lists_count: listsCount,
      repos_count: reposCount,
      readmes_count: readmesCount,
      build_mode: BUILD_MODE,
      source_repo: AWESOME_REPO
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'db-metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    log('✓ Metadata generated', 'green');
    log(`  Lists: ${listsCount}`, 'blue');
    log(`  Repositories: ${reposCount}`, 'blue');
    log(`  READMEs: ${readmesCount}`, 'blue');
    log(`  Size: ${size} MB`, 'blue');

    return metadata;
  } catch (error) {
    log(`⚠️  Failed to generate metadata: ${error.message}`, 'yellow');
    return null;
  }
}

async function main() {
  log('\n' + '='.repeat(60), 'bright');
  log('  🚀 AWESOME DATABASE BUILDER', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  log(`Build Mode: ${BUILD_MODE}`, 'cyan');
  log(`Source Repo: ${AWESOME_REPO}\n`, 'cyan');

  let success = false;

  if (BUILD_MODE === 'download') {
    success = await downloadDatabase();

    if (!success) {
      log('\n⚠️  Download failed, attempting local build...', 'yellow');
      success = await buildDatabaseLocally();
    }
  } else {
    success = await buildDatabaseLocally();
  }

  if (!success) {
    log('\n❌ Database build failed', 'red');
    process.exit(1);
  }

  // Generate metadata
  await generateMetadata();

  log('\n' + '='.repeat(60), 'bright');
  log('  ✅ BUILD COMPLETE', 'green');
  log('='.repeat(60) + '\n', 'bright');

  log(`Database: ${DB_PATH}`, 'cyan');
  log(`Metadata: ${path.join(process.cwd(), 'db-metadata.json')}\n`, 'cyan');
}

// Run
main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
