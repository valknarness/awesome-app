'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Search, Star, BookOpen, Home, FileText, Code } from 'lucide-react'

interface CommandMenuProps {
  open: boolean
  setOpen: (open: boolean) => void
}


export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const router = useRouter()
  const [search, setSearch] = React.useState('')
  const [results, setResults] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  // declare the async data fetching function
const fetchData = React.useCallback(async () => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(search)}`)
    const data = await response.json()
    setResults(...data.results);
}, [])

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
    if (!search) {
      return
    }
    setLoading(true)
    fetchData()
    console.log(results)
    setLoading(false)
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
    <CommandDialog open={open} onOpenChange={setOpen}>
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
            {results.map((result: any) => (
              <CommandItem
                key={result.repository_id}
                value={result.repository_name}
                onSelect={() => runCommand(() => router.push(result.url))}
              >
                {getIcon(result.type)}
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{result.title}</span>
                    {result.stars && (
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
                  {result.category && (
                    <span className="text-xs text-primary">
                      {result.category}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
