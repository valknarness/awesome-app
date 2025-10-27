'use client'

import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ExternalLink, GitFork, Star, Code, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PushToListButton } from '@/components/personal-list/push-to-list-button'
import { ReadmeViewer } from '@/components/readme/readme-viewer'

interface Repository {
  id: number
  name: string
  url: string
  description: string | null
  stars: number | null
  forks: number | null
  language: string | null
  topics: string | null
}

interface Readme {
  content: string
}

interface RepositoryDetailResponse {
  id: number
  name: string
  url: string
  description: string | null
  stars: number | null
  forks: number | null
  language: string | null
  topics: string | null
  readme: Readme | null
}

export default function RepositoryDetailPage() {
  const params = useParams()
  const repositoryId = params.id as string

  const [data, setData] = React.useState<RepositoryDetailResponse | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`/api/repositories/${repositoryId}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch repository')
        }
        return res.json()
      })
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch repository:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [repositoryId])

  const topics = data?.topics ? data.topics.split(',') : []

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <Skeleton className="mb-8 h-10 w-32" />
          <Skeleton className="mb-4 h-12 w-2/3" />
          <Skeleton className="mb-8 h-6 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 px-6 py-12">
        <div className="mx-auto max-w-5xl text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h1 className="mb-4 text-3xl font-bold">Repository Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The repository you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
          </p>
          <Button asChild>
            <Link href="/browse">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="mb-4">
            <Button asChild variant="ghost">
              <Link href="/browse">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Browse
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="gradient-text mb-3 text-4xl font-bold">{data.name}</h1>

              {data.description && (
                <p className="mb-4 text-lg text-muted-foreground">{data.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                {data.language && (
                  <Badge variant="secondary" className="text-sm">
                    <Code className="mr-1 h-3 w-3" />
                    {data.language}
                  </Badge>
                )}

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {data.stars !== null && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-accent" />
                      <span>{data.stars.toLocaleString()} stars</span>
                    </div>
                  )}
                  {data.forks !== null && (
                    <div className="flex items-center gap-1">
                      <GitFork className="h-4 w-4" />
                      <span>{data.forks.toLocaleString()} forks</span>
                    </div>
                  )}
                </div>
              </div>

              {topics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {topics.slice(0, 10).map((topic) => (
                    <Badge key={topic} variant="outline">
                      {topic.trim()}
                    </Badge>
                  ))}
                  {topics.length > 10 && (
                    <Badge variant="outline">
                      +{topics.length - 10} more
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={data.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>

              <PushToListButton
                title={data.name}
                description={data.description || 'No description available'}
                url={data.url}
                repository={data.name}
                variant="outline"
                size="sm"
                showLabel={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* README Content */}
      <div className="mx-auto max-w-5xl px-6 py-8">
        {data.readme?.content ? (
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
            <ReadmeViewer content={data.readme.content} />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
            <AlertCircle className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No README Available</h3>
            <p className="text-muted-foreground">
              This repository doesn&apos;t have a README file or it couldn&apos;t be loaded.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
