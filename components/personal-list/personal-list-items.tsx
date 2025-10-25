'use client'

import * as React from 'react'
import { Trash2, ExternalLink, Calendar, Tag, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePersonalListStore } from '@/lib/personal-list-store'
import { cn } from '@/lib/utils'

export function PersonalListItems() {
  const { items, removeItem } = usePersonalListStore()

  if (items.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Folder className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 font-semibold text-lg">No items yet</h3>
          <p className="text-muted-foreground text-sm">
            Start building your awesome list by clicking
            <br />
            <span className="gradient-text font-semibold">&quot;Push to my list&quot;</span>{' '}
            on any repository
          </p>
        </div>
      </div>
    )
  }

  // Group items by category
  const categorized = items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <div className="space-y-6">
      {Object.entries(categorized).map(([category, categoryItems]) => (
        <div key={category} className="space-y-3">
          <h3 className="flex items-center gap-2 font-semibold text-lg">
            <Folder className="h-5 w-5 text-primary" />
            <span className="gradient-text">{category}</span>
            <Badge variant="secondary" className="ml-auto">
              {categoryItems.length}
            </Badge>
          </h3>

          <div className="space-y-3">
            {categoryItems.map((item) => (
              <Card
                key={item.id}
                className="group card-awesome border-l-4 transition-all hover:shadow-lg"
                style={{
                  borderLeftColor: 'var(--color-primary)',
                }}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start justify-between gap-2">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                    >
                      <span className="line-clamp-1">{item.title}</span>
                      <ExternalLink className="h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-muted-foreground text-sm">{item.description}</p>

                  {item.repository && (
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className="font-mono">
                        {item.repository}
                      </Badge>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(item.addedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <>
                        <span className="text-muted-foreground/50">•</span>
                        <div className="flex items-center gap-1.5">
                          <Tag className="h-3 w-3" />
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="h-5 px-1.5 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
