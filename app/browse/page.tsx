'use client'

import * as React from 'react'
import Link from 'next/link'
import { Folder, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

interface AwesomeList {
  id: number
  name: string
  url: string
  description: string | null
  category: string | null
  stars: number | null
}

interface Category {
  name: string
  count: number
}

interface BrowseResponse {
  lists: AwesomeList[]
  categories: Category[]
  total: number
}

export default function BrowsePage() {
  const [data, setData] = React.useState<BrowseResponse | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('')

  React.useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory) {
      params.set('category', selectedCategory)
    }

    fetch(`/api/lists?${params}`)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch lists:', err)
        setLoading(false)
      })
  }, [selectedCategory])

  const filteredLists = React.useMemo(() => {
    if (!data) return []

    let filtered = data.lists

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(list =>
        list.name.toLowerCase().includes(query) ||
        list.description?.toLowerCase().includes(query) ||
        list.category?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [data, searchQuery])

  // Group lists by category
  const groupedLists = React.useMemo(() => {
    const groups: Record<string, AwesomeList[]> = {}

    filteredLists.forEach(list => {
      const category = list.category || 'Uncategorized'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(list)
    })

    // Sort categories by name
    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key].sort((a, b) => (b.stars || 0) - (a.stars || 0))
        return acc
      }, {} as Record<string, AwesomeList[]>)
  }, [filteredLists])

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="gradient-text mb-4 text-3xl font-bold">Browse Collections</h1>
          <p className="mb-6 text-muted-foreground">
            Explore {data?.total || '...'} curated awesome lists organized by category
          </p>

          {/* Filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={selectedCategory || 'all'} onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {data?.categories.map(cat => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name} ({cat.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {loading && (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-4 h-8 w-48" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, j) => (
                    <Skeleton key={j} className="h-32" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && Object.keys(groupedLists).length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No lists found matching your criteria
            </p>
          </div>
        )}

        {!loading && Object.keys(groupedLists).length > 0 && (
          <div className="space-y-12">
            {Object.entries(groupedLists).map(([category, lists]) => (
              <section key={category}>
                <div className="mb-4 flex items-center gap-3">
                  <Folder className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">{category}</h2>
                  <Badge variant="secondary">{lists.length}</Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {lists.map(list => (
                    <Link
                      key={list.id}
                      href={`/list/${list.id}`}
                      className="card-awesome group block rounded-lg bg-card p-6 transition-all"
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-primary group-hover:text-primary/80">
                          {list.name}
                        </h3>
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                      </div>

                      {list.description && (
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {list.description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
