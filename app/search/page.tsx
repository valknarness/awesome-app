'use client'

import * as React from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, Star, Filter, SlidersHorizontal, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'

interface SearchResult {
  repository_id: number
  repository_name: string
  repository_url: string
  description: string | null
  stars: number | null
  language: string | null
  topics: string | null
  awesome_list_name: string | null
  awesome_list_category: string | null
  snippet: string | null
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface StatsResponse {
  languages: { name: string; count: number }[]
  categories: { name: string; count: number }[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [query, setQuery] = React.useState(searchParams.get('q') || '')
  const [results, setResults] = React.useState<SearchResponse | null>(null)
  const [stats, setStats] = React.useState<StatsResponse | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [filters, setFilters] = React.useState({
    language: searchParams.get('language') || '',
    category: searchParams.get('category') || '',
    minStars: searchParams.get('minStars') || '',
    sortBy: (searchParams.get('sortBy') as 'relevance' | 'stars' | 'recent') || 'relevance'
  })

  // Fetch stats for filters
  React.useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Failed to fetch stats:', err))
  }, [])

  // Perform search
  const performSearch = React.useCallback((searchQuery: string, page = 1) => {
    if (!searchQuery.trim()) {
      setResults(null)
      return
    }

    setLoading(true)

    const params = new URLSearchParams({
      q: searchQuery,
      page: page.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      )
    })

    fetch(`/api/search?${params}`)
      .then(res => res.json())
      .then(data => {
        // Check if response is an error
        if (data.error || !data.results) {
          console.error('Search API error:', data.error || 'Invalid response')
          setResults(null)
          return
        }
        setResults(data)
        // Update URL
        router.push(`/search?${params}`)
      })
      .catch(err => {
        console.error('Search failed:', err)
        setResults(null)
      })
      .finally(() => setLoading(false))
  }, [filters, router])

  // Search on query change (debounced)
  React.useEffect(() => {
    const initialQuery = searchParams.get('q')
    if (initialQuery) {
      setQuery(initialQuery)
      performSearch(initialQuery, parseInt(searchParams.get('page') || '1'))
    }
  }, []) // Only on mount

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  React.useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [filters.sortBy, filters.language, filters.category, filters.minStars])

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="gradient-text mb-4 text-3xl font-bold">Search Awesome</h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search repositories, topics, descriptions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 text-base"
                autoFocus
              />
            </div>
            <Button type="submit" className="btn-awesome" disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>

          {/* Quick Filters */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Select value={filters.sortBy} onValueChange={(v: string) => handleFilterChange('sortBy', v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="stars">Most Stars</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="default">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {(filters.language || filters.category || filters.minStars) && (
                    <Badge variant="secondary" className="ml-2">
                      {[filters.language, filters.category, filters.minStars].filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search results
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Language</label>
                    <Select value={filters.language || 'all'} onValueChange={(v: string) => handleFilterChange('language', v === 'all' ? '' : v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All languages" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All languages</SelectItem>
                        {stats?.languages.slice(0, 20).map(lang => (
                          <SelectItem key={lang.name} value={lang.name}>
                            {lang.name} ({lang.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Category</label>
                    <Select value={filters.category || 'all'} onValueChange={(v: string) => handleFilterChange('category', v === 'all' ? '' : v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {stats?.categories.map(cat => (
                          <SelectItem key={cat.name} value={cat.name}>
                            {cat.name} ({cat.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Minimum Stars</label>
                    <Select value={filters.minStars || 'any'} onValueChange={(v: string) => handleFilterChange('minStars', v === 'any' ? '' : v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="100">100+</SelectItem>
                        <SelectItem value="500">500+</SelectItem>
                        <SelectItem value="1000">1,000+</SelectItem>
                        <SelectItem value="5000">5,000+</SelectItem>
                        <SelectItem value="10000">10,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setFilters({ language: '', category: '', minStars: '', sortBy: 'relevance' })}
                  >
                    Clear Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-6">
                <Skeleton className="mb-2 h-6 w-2/3" />
                <Skeleton className="mb-4 h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results && results.total !== undefined && (
          <>
            <div className="mb-6 text-muted-foreground">
              Found <strong>{results.total.toLocaleString()}</strong> results
              {query && <> for &quot;<strong>{query}</strong>&quot;</>}
            </div>

            <div className="space-y-4">
              {results.results.map((result) => (
                <div key={result.repository_id} className="card-awesome rounded-lg bg-card p-6">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold">
                      <a
                        href={result.repository_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-primary hover:text-primary/80"
                      >
                        {result.repository_name}
                        <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    </h3>
                    {result.stars !== null && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-current text-accent" />
                        <span>{result.stars.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {result.description && (
                    <p className="mb-3 text-muted-foreground">{result.description}</p>
                  )}

                  {result.snippet && (
                    <div
                      className="mb-3 rounded border-l-2 border-primary/40 bg-muted/50 p-3 text-sm"
                      dangerouslySetInnerHTML={{ __html: result.snippet }}
                    />
                  )}

                  <div className="flex flex-wrap gap-2">
                    {result.language && (
                      <Badge variant="secondary">{result.language}</Badge>
                    )}
                    {result.awesome_list_category && (
                      <Badge variant="outline">{result.awesome_list_category}</Badge>
                    )}
                    {result.awesome_list_name && (
                      <Badge variant="outline" className="text-xs">
                        {result.awesome_list_name}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {results.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={results.page === 1}
                  onClick={() => performSearch(query, results.page - 1)}
                >
                  Previous
                </Button>
                <span className="mx-4 text-sm text-muted-foreground">
                  Page {results.page} of {results.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={results.page === results.totalPages}
                  onClick={() => performSearch(query, results.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {!loading && !results && query && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              Enter a search query to find awesome repositories
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
