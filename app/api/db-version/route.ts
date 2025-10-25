import { NextResponse } from 'next/server';
import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

// Get database version and metadata
export async function GET() {
  try {
    // Use the database from the user's home directory
    const homeDir = process.env.HOME || process.env.USERPROFILE || '';
    const dbPath = join(homeDir, '.awesome', 'awesome.db');
    const metadataPath = join(homeDir, '.awesome', 'db-metadata.json');

    if (!existsSync(dbPath)) {
      return NextResponse.json(
        { error: 'Database not found' },
        { status: 404 }
      );
    }

    // Get file stats
    const stats = statSync(dbPath);

    // Calculate hash for version
    const buffer = readFileSync(dbPath);
    const hash = createHash('sha256').update(buffer).digest('hex');

    // Load metadata if available
    let metadata = {};
    if (existsSync(metadataPath)) {
      metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
    }

    return NextResponse.json({
      version: hash.substring(0, 16),
      size: stats.size,
      modified: stats.mtime.toISOString(),
      ...metadata,
    });
  } catch (error) {
    console.error('Error getting DB version:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
