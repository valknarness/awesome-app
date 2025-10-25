'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, GitFork, Code, List, Star, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useParams } from 'next/navigation'
import { SlidingPanel, SlidingPanelMain, SlidingPanelSide } from '@/components/personal-list/sliding-panel'
import { PersonalListEditor } from '@/components/personal-list/personal-list-editor'
import { PushToListButton } from '@/components/personal-list/push-to-list-button'
import { usePersonalListStore } from '@/lib/personal-list-store'

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

interface AwesomeList {
  id: number
  name: string
  url: string
  description: string | null
  category: string | null
  stars: number | null
}

interface ListDetailResponse {
  list: AwesomeList
  repositories: {
    results: Repository[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export default function ListDetailPage() {
  const params = useParams()
  const listId = params.id as string

  const [data, setData] = React.useState<ListDetailResponse | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [page, setPage] = React.useState(1)
  const { isEditorOpen, closeEditor, openEditor } = usePersonalListStore()

  React.useEffect(() => {
    setLoading(true)
    fetch(`/api/lists/${listId}?page=${page}`)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch list:', err)
        setLoading(false)
      })
  }, [listId, page])

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="mb-8 h-10 w-32" />
          <Skeleton className="mb-4 h-12 w-2/3" />
          <Skeleton className="mb-8 h-6 w-full" />
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 px-6 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-4 text-3xl font-bold">List Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The awesome list you&apos;re looking for doesn&apos;t exist.
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

  const { list, repositories } = data

  return (
    <div className="min-h-screen">
      <SlidingPanel isOpen={isEditorOpen} onClose={closeEditor}>
        <SlidingPanelMain>
          <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
            {/* Header */}
            <div className="border-b bg-background/80 backdrop-blur-sm">
              <div className="mx-auto max-w-7xl px-6 py-6">
                <div className="mb-4 flex items-center justify-between">
                  <Button asChild variant="ghost">
                    <Link href="/browse">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Browse
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openEditor}
                    className="gap-2"
                  >
                    <List className="h-4 w-4" />
                    My Awesome List
                  </Button>
                </div>

                <h1 className="gradient-text mb-3 text-4xl font-bold">{list.name}</h1>

                {list.description && (
                  <p className="mb-4 text-lg text-muted-foreground">{list.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  {list.category && (
                    <Badge variant="secondary" className="text-sm">
                      {list.category}
                    </Badge>
                  )}
                  <Button asChild variant="outline" size="sm">
                    <a href={list.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on GitHub
                    </a>
                  </Button>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {repositories.results.length} of {repositories.total.toLocaleString()} repositories
                </div>
              </div>
            </div>

            {/* Repositories */}
            <div className="mx-auto max-w-7xl px-6 py-8">
              <div className="space-y-4">
                {repositories.results.map((repo) => {
                  const topics = repo.topics ? repo.topics.split(',') : []

                  return (
                    <div key={repo.id} className="card-awesome rounded-lg bg-card p-6">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <h3 className="flex-1 text-xl font-semibold">
                          <Link
                            href={`/repository/${repo.id}`}
                            className="group inline-flex items-center gap-2 text-primary hover:text-primary/80"
                          >
                            {repo.name}
                            <FileText className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                          </Link>
                        </h3>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            {repo.stars !== null && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-current text-accent" />
                                <span>{repo.stars.toLocaleString()}</span>
                              </div>
                            )}
                            {repo.forks !== null && (
                              <div className="flex items-center gap-1">
                                <GitFork className="h-4 w-4" />
                                <span>{repo.forks.toLocaleString()}</span>
                              </div>
                            )}
                          </div>

                          <PushToListButton
                            title={repo.name}
                            description={repo.description || 'No description available'}
                            url={repo.url}
                            repository={repo.name}
                            variant="outline"
                            size="sm"
                            showLabel={false}
                          />
                        </div>
                      </div>

                      {repo.description && (
                        <p className="mb-3 text-muted-foreground">{repo.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-2">
                        {repo.language && (
                          <Badge variant="secondary">
                            <Code className="mr-1 h-3 w-3" />
                            {repo.language}
                          </Badge>
                        )}
                        {topics.slice(0, 5).map((topic) => (
                          <Badge key={topic} variant="outline">
                            {topic.trim()}
                          </Badge>
                        ))}
                        {topics.length > 5 && (
                          <Badge variant="outline">
                            +{topics.length - 5} more
                          </Badge>
                        )}

                        <Link href={`/repository/${repo.id}`} className="ml-auto">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <FileText className="h-4 w-4" />
                            <span>View README</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {repositories.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    disabled={repositories.page === 1}
                    onClick={() => setPage(repositories.page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="mx-4 text-sm text-muted-foreground">
                    Page {repositories.page} of {repositories.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={repositories.page === repositories.totalPages}
                    onClick={() => setPage(repositories.page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SlidingPanelMain>

        <SlidingPanelSide title="My Awesome List">
          <PersonalListEditor />
        </SlidingPanelSide>
      </SlidingPanel>
    </div>
  )
}
