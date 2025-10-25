'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Home, BookOpen, Menu, List as ListIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/theme/theme-switcher'
import { Badge } from '@/components/ui/badge'
import { AwesomeIcon } from '@/components/ui/awesome-icon'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { usePersonalListStore } from '@/lib/personal-list-store'

export function AppHeader() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { items } = usePersonalListStore()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'Search',
      href: '/search',
      icon: Search,
    },
    {
      name: 'Browse',
      href: '/browse',
      icon: BookOpen,
    },
  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        isScrolled
          ? 'border-border/40 bg-background/95 shadow-lg backdrop-blur-xl'
          : 'border-transparent bg-background/80 backdrop-blur-sm'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-background p-1.5 shadow-lg ring-1 ring-primary/10 transition-all hover:ring-primary/30 hover:shadow-xl hover:shadow-primary/20">
            <AwesomeIcon size={32} className="drop-shadow-sm" />
          </div>
          <span className="gradient-text hidden text-xl font-bold sm:inline">
            Awesome
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Search Button - Hidden on search page */}
          {pathname !== '/search' && (
            <Link href="/search">
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-2 border-primary/20 sm:inline-flex"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search</span>
                <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-xs lg:inline">
                  ⌘K
                </kbd>
              </Button>
            </Link>
          )}

          {/* Personal List Button */}
          <Link href="/my-list">
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-2 border-primary/20 sm:inline-flex"
            >
              <ListIcon className="h-4 w-4" />
              <span className="hidden lg:inline">My List</span>
              {items.length > 0 && (
                <Badge variant="default" className="h-5 min-w-5 px-1 text-xs">
                  {items.length}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" className="border-primary/20">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <AwesomeIcon size={20} />
                  <span className="gradient-text">Awesome</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
