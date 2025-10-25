'use client'

import * as React from 'react'
import Link from 'next/link'
import { Star, Share2, ExternalLink, Copy, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface ReadmeHeaderProps {
  metadata: {
    title: string
    description: string
    stars: number
    lastUpdated: string
    url: string
  }
}

export function ReadmeHeader({ metadata }: ReadmeHeaderProps) {
  const [isSticky, setIsSticky] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleShare = (type: 'twitter' | 'email' | 'reddit') => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(`Check out ${metadata.title}: ${metadata.description}`)

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      email: `mailto:?subject=${encodeURIComponent(metadata.title)}&body=${text}%20${url}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${encodeURIComponent(metadata.title)}`,
    }

    window.open(shareUrls[type], '_blank', 'noopener,noreferrer')
  }

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isSticky
          ? 'bg-background/95 shadow-lg backdrop-blur-sm'
          : 'bg-background/80 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left side */}
          <div className="flex-1">
            <h1 className="gradient-text mb-2 text-2xl font-bold sm:text-3xl">
              {metadata.title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {metadata.description}
            </p>
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Stars */}
            <div className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
              <Star className="h-4 w-4 fill-current" />
              <span>{metadata.stars.toLocaleString()}</span>
            </div>

            {/* Share Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('twitter')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Share on Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('reddit')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Share on Reddit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare('email')}>
                  <Mail className="mr-2 h-4 w-4" />
                  Share via Email
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* GitHub Link */}
            <Button asChild variant="default" size="default" className="gap-2">
              <Link href={metadata.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">View on GitHub</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Last updated */}
        <div className="mt-2 text-xs text-muted-foreground">
          Last updated: {new Date(metadata.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </header>
  )
}
