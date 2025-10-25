import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ReadmeViewer } from '@/components/readme/readme-viewer'
import { ReadmeHeader } from '@/components/readme/readme-header'
import { Skeleton } from '@/components/ui/skeleton'
import { getDb } from '@/lib/db'

interface PageProps {
  params: Promise<{
    owner: string
    repo: string
  }>
}

async function getReadmeContent(owner: string, repo: string) {
  try {
    const db = getDb()

    // Find repository by URL pattern
    const repoUrl = `https://github.com/${owner}/${repo}`
    const repository = db.prepare(`
      SELECT r.*, rm.content, rm.raw_content
      FROM repositories r
      LEFT JOIN readmes rm ON r.id = rm.repository_id
      WHERE r.url = ? OR r.url LIKE ?
      LIMIT 1
    `).get(repoUrl, `%${owner}/${repo}%`) as any

    if (!repository || !repository.content) {
      return null // Not found in database
    }

    // Return actual README content from database
    return {
      content: repository.content || repository.raw_content || '',
      metadata: {
        title: repository.name,
        description: repository.description || `Repository: ${repository.name}`,
        stars: repository.stars || 0,
        lastUpdated: repository.last_commit || new Date().toISOString(),
        url: repository.url,
      },
    }
  } catch (error) {
    console.error('Failed to fetch README:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { owner, repo } = await params
  const data = await getReadmeContent(owner, repo)

  if (!data) {
    return {
      title: 'Not Found',
    }
  }

  return {
    title: `${data.metadata.title} | Awesome`,
    description: data.metadata.description,
    openGraph: {
      title: data.metadata.title,
      description: data.metadata.description,
      type: 'article',
    },
  }
}

export default async function ReadmePage({ params }: PageProps) {
  const { owner, repo } = await params
  const data = await getReadmeContent(owner, repo)

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <ReadmeHeader metadata={data.metadata} />

      <div className="mx-auto max-w-5xl px-6 py-12">
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          }
        >
          <ReadmeViewer content={data.content} />
        </Suspense>
      </div>
    </div>
  )
}
