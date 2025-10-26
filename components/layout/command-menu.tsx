'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Search, Star, BookOpen, Home, FileText, Code } from 'lucide-react'

interface CommandMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
}

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


export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const router = useRouter()
  const [search, setSearch] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  React.useEffect(() => {
    // Clear results if search is empty
    if (!search || search.trim() === '') {
      setResults([])
      setLoading(false)
      return
    }

    // Debounce search
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        // Match the search page API call with same parameters
        const params = new URLSearchParams({
          q: search,
          page: '1',
          sortBy: 'relevance',
          limit: '10' // Limit to 10 results for command menu
        })

        const response = await fetch(`/api/search?${params}`)

        if (!response.ok) {
          console.error('Search API error:', response.status, response.statusText)
          setResults([])
          return
        }

        const data: SearchResponse = await response.json()

        // Check if response has error or invalid data
        if (!data.results) {
          console.error('Invalid search response:', data)
          setResults([])
          return
        }

        console.log('Search results:', data.results.length, 'results for:', search)
        setResults(data.results)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [setOpen])

  const pages  = [
    {
      id: 'home',
      type: 'page',
      title: 'Home',
      url: '/',
    },
    {
      id: 'browse',
      type: 'page',
      title: 'Browse Collections',
      url: '/browse',
    },
    {
      id: 'search',
      type: 'page',
      title: 'Search',
      url: '/search',
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case 'list':
        return <Star className="mr-2 h-4 w-4" />
      case 'repo':
        return <Code className="mr-2 h-4 w-4" />
      case 'page':
        return <FileText className="mr-2 h-4 w-4" />
      default:
        return <BookOpen className="mr-2 h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0" aria-describedby={undefined}>
        <DialogTitle className="sr-only">Search</DialogTitle>
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput
            placeholder="Search awesome lists, repos, and more..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
        <CommandEmpty>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="spinner-awesome h-8 w-8" />
            </div>
          ) : (
            <div className="py-6 text-center text-sm">
              No results found for &quot;{search}&quot;
            </div>
          )}
        </CommandEmpty>

        {!search && (
          <React.Fragment key="pages-group">
            <CommandGroup heading="Pages">
              {pages.map((page) => (
                <CommandItem
                  key={page.id}
                  value={page.title}
                  onSelect={() => runCommand(() => router.push(page.url))}
                >
                  {getIcon(page.type)}
                  <span>{page.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </React.Fragment>
        )}

        {results.length > 0 && (
          <CommandGroup heading="Search Results">
            {results.map((result) => (
              <CommandItem
                key={result.repository_id}
                value={result.repository_name}
                onSelect={() => runCommand(() => router.push(`/repository/${result.repository_id}`))}
              >
                <Code className="mr-2 h-4 w-4" />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{result.repository_name}</span>
                    {result.stars !== null && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-current" />
                        {result.stars.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {result.description && (
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {result.description}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    {result.language && (
                      <span className="text-xs text-muted-foreground">
                        {result.language}
                      </span>
                    )}
                    {result.awesome_list_category && (
                      <span className="text-xs text-primary">
                        {result.awesome_list_category}
                      </span>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
