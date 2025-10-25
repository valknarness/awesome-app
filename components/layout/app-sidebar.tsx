'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronRight,
  Home,
  Search,
  Star,
  BookOpen,
  Code,
  Layers,
  Package,
  Globe,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AwesomeIcon } from '@/components/ui/awesome-icon'

interface Category {
  name: string
  icon: React.ReactNode
  lists: ListItem[]
  expanded?: boolean
}

interface ListItem {
  id: string
  name: string
  url: string
  stars?: number
}

export function AppSidebar() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(['Front-end Development'])
  )

  // Mock data - will be replaced with actual API call
  const categories: Category[] = [
    {
      name: 'Front-end Development',
      icon: <Code className="h-4 w-4" />,
      lists: [
        { id: 'react', name: 'React', url: '/list/react', stars: 45000 },
        { id: 'vue', name: 'Vue.js', url: '/list/vue', stars: 38000 },
        { id: 'angular', name: 'Angular', url: '/list/angular', stars: 32000 },
        { id: 'svelte', name: 'Svelte', url: '/list/svelte', stars: 28000 },
        { id: 'css', name: 'CSS', url: '/list/css', stars: 25000 },
        { id: 'tailwind', name: 'Tailwind CSS', url: '/list/tailwind', stars: 22000 },
      ],
    },
    {
      name: 'Back-end Development',
      icon: <Layers className="h-4 w-4" />,
      lists: [
        { id: 'nodejs', name: 'Node.js', url: '/list/nodejs', stars: 38000 },
        { id: 'python', name: 'Python', url: '/list/python', stars: 52000 },
        { id: 'go', name: 'Go', url: '/list/go', stars: 35000 },
        { id: 'rust', name: 'Rust', url: '/list/rust', stars: 30000 },
        { id: 'java', name: 'Java', url: '/list/java', stars: 28000 },
        { id: 'dotnet', name: '.NET', url: '/list/dotnet', stars: 24000 },
      ],
    },
    {
      name: 'Programming Languages',
      icon: <Code className="h-4 w-4" />,
      lists: [
        { id: 'javascript', name: 'JavaScript', url: '/list/javascript', stars: 48000 },
        { id: 'typescript', name: 'TypeScript', url: '/list/typescript', stars: 42000 },
        { id: 'python-lang', name: 'Python', url: '/list/python-lang', stars: 52000 },
        { id: 'rust-lang', name: 'Rust', url: '/list/rust-lang', stars: 30000 },
        { id: 'go-lang', name: 'Go', url: '/list/go-lang', stars: 35000 },
      ],
    },
    {
      name: 'Platforms',
      icon: <Globe className="h-4 w-4" />,
      lists: [
        { id: 'docker', name: 'Docker', url: '/list/docker', stars: 40000 },
        { id: 'kubernetes', name: 'Kubernetes', url: '/list/kubernetes', stars: 38000 },
        { id: 'aws', name: 'AWS', url: '/list/aws', stars: 35000 },
        { id: 'azure', name: 'Azure', url: '/list/azure', stars: 28000 },
      ],
    },
    {
      name: 'Tools',
      icon: <Package className="h-4 w-4" />,
      lists: [
        { id: 'vscode', name: 'VS Code', url: '/list/vscode', stars: 45000 },
        { id: 'git', name: 'Git', url: '/list/git', stars: 42000 },
        { id: 'vim', name: 'Vim', url: '/list/vim', stars: 38000 },
        { id: 'cli', name: 'CLI', url: '/list/cli', stars: 35000 },
      ],
    },
  ]

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryName)) {
        next.delete(categoryName)
      } else {
        next.add(categoryName)
      }
      return next
    })
  }

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery) return categories

    return categories
      .map((category) => ({
        ...category,
        lists: category.lists.filter((list) =>
          list.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((category) => category.lists.length > 0)
  }, [searchQuery])

  return (
    <Sidebar>
      <SidebarContent>
        {/* Header */}
        <SidebarGroup>
          <div className="px-4 py-4">
            <Link href="/" className="flex items-center gap-2">
              <AwesomeIcon size={24} />
              <span className="gradient-text text-xl font-bold">Awesome</span>
            </Link>
          </div>
        </SidebarGroup>

        {/* Search Input */}
        <SidebarGroup>
          <div className="px-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search lists..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'}>
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/search'}>
                  <Link href="/search">
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/browse'}>
                  <Link href="/browse">
                    <BookOpen className="h-4 w-4" />
                    <span>Browse</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Categories */}
        <ScrollArea className="flex-1">
          {filteredCategories.map((category) => {
            const isExpanded = expandedCategories.has(category.name)

            return (
              <SidebarGroup key={category.name}>
                <SidebarGroupLabel asChild>
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="group flex w-full items-center justify-between px-2 py-1.5 text-sm font-semibold transition-colors hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded && 'rotate-90'
                      )}
                    />
                  </button>
                </SidebarGroupLabel>
                {isExpanded && (
                  <SidebarGroupContent>
                    <SidebarMenuSub>
                      {category.lists.map((list) => (
                        <SidebarMenuSubItem key={list.id}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === list.url}
                          >
                            <Link href={list.url}>
                              <span className="flex-1">{list.name}</span>
                              {list.stars && (
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Star className="h-3 w-3 fill-current" />
                                  {(list.stars / 1000).toFixed(0)}k
                                </span>
                              )}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarGroupContent>
                )}
              </SidebarGroup>
            )
          })}
        </ScrollArea>

        {/* Footer */}
        <SidebarGroup className="mt-auto border-t">
          <div className="px-4 py-3 text-xs text-muted-foreground">
            <div className="mb-1 font-semibold">Built with 💜💗💛</div>
            <div>Updated every 6 hours</div>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
