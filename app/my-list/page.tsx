'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PersonalListEditor } from '@/components/personal-list/personal-list-editor'
import { usePersonalListStore } from '@/lib/personal-list-store'
import { AwesomeIcon } from '@/components/ui/awesome-icon'

export default function MyListPage() {
  const { items, generateMarkdown } = usePersonalListStore()

  const handleExportMarkdown = () => {
    const md = generateMarkdown()
    const blob = new Blob([md], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `my-awesome-list-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            {items.length > 0 && (
              <Button onClick={handleExportMarkdown} variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                Export Markdown
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-awesome p-2 shadow-lg">
              <AwesomeIcon size={32} className="[&_path]:fill-white [&_circle]:fill-white/80" />
            </div>
            <div>
              <h1 className="gradient-text text-4xl font-bold">My Awesome List</h1>
              <p className="text-muted-foreground">
                {items.length === 0
                  ? 'Start building your personal collection'
                  : `${items.length} ${items.length === 1 ? 'item' : 'items'} in your collection`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="mx-auto h-[calc(100vh-180px)] max-w-7xl px-6 py-8">
        <div className="h-full overflow-hidden rounded-lg border border-border bg-card shadow-xl">
          <PersonalListEditor />
        </div>
      </div>
    </div>
  )
}
