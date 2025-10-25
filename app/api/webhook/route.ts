import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';

export const dynamic = 'force-dynamic';

// Verify webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return digest === signature;
}

// Handle webhook from GitHub Actions
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-github-secret');
    const body = await request.text();

    // Verify signature if secret is configured
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      if (!verifySignature(body, signature, webhookSecret)) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const data = JSON.parse(body);

    console.log('📥 Webhook received:', {
      version: data.version,
      timestamp: data.timestamp,
      lists: data.lists_count,
      repos: data.repos_count,
    });

    // Save metadata
    const metadataPath = join(process.cwd(), 'data', 'db-metadata.json');
    writeFileSync(metadataPath, JSON.stringify(data, null, 2));

    // TODO: Trigger database download from hosting
    // const dbUrl = process.env.DB_URL;
    // await downloadDatabase(dbUrl);

    return NextResponse.json({
      success: true,
      message: 'Database metadata updated',
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
