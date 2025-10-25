'use client'

import * as React from 'react'
import {
  Download,
  Upload,
  FileText,
  Eye,
  Code,
  LayoutGrid,
  Trash2,
  Save,
  Copy,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  EditorProvider,
  EditorBubbleMenu,
  EditorFormatBold,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorFormatCode,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeHeading3,
  EditorNodeBulletList,
  EditorNodeOrderedList,
  EditorNodeTaskList,
  EditorNodeQuote,
  EditorNodeCode,
  EditorLinkSelector,
  EditorClearFormatting,
  type JSONContent,
} from '@/components/ui/shadcn-io/editor'
import { usePersonalListStore } from '@/lib/personal-list-store'
import { cn } from '@/lib/utils'
import { PersonalListItems } from './personal-list-items'

export function PersonalListEditor() {
  const {
    markdown,
    setMarkdown,
    activeView,
    setActiveView,
    items,
    generateMarkdown,
    exportList,
    importList,
    clearList,
  } = usePersonalListStore()

  const [content, setContent] = React.useState<JSONContent | string>(markdown)
  const [copied, setCopied] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Update content when markdown changes
  React.useEffect(() => {
    setContent(markdown)
  }, [markdown])

  const handleEditorUpdate = React.useCallback(
    ({ editor }: { editor: any }) => {
      const md = editor.storage.markdown?.getMarkdown() || editor.getText()
      setMarkdown(md)
    },
    [setMarkdown]
  )

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
    toast.success('Markdown exported successfully!')
  }

  const handleExportJSON = () => {
    const data = exportList()
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `my-awesome-list-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('List exported successfully!')
  }

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        importList(data)
        toast.success('List imported successfully!')
      } catch (error) {
        toast.error('Failed to import list. Invalid JSON format.')
      }
    }
    reader.readAsText(file)
  }

  const handleCopyMarkdown = async () => {
    const md = generateMarkdown()
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Markdown copied to clipboard!')
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your entire list? This cannot be undone.')) {
      clearList()
      toast.success('List cleared successfully!')
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
        <TooltipProvider>
          <div className="flex items-center gap-1">
            {/* View Mode Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === 'editor' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setActiveView('editor')}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editor Mode</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === 'split' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setActiveView('split')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Split View</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeView === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setActiveView('preview')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview Mode</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-2 h-6" />

            {/* Actions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleCopyMarkdown}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy Markdown</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleExportMarkdown}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export Markdown</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleExportJSON}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export JSON</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Import JSON</TooltipContent>
            </Tooltip>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportJSON}
            />

            <Separator orientation="vertical" className="mx-2 h-6" />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleClear}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear List</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <div className="text-muted-foreground text-xs">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor View */}
        {(activeView === 'editor' || activeView === 'split') && (
          <div
            className={cn(
              'flex-1 overflow-auto border-r border-border p-4',
              activeView === 'split' && 'w-1/2'
            )}
          >
            <EditorProvider
              content={content}
              onUpdate={handleEditorUpdate}
              placeholder="Start writing your awesome list in markdown..."
              className="prose prose-sm dark:prose-invert max-w-none"
              immediatelyRender={false}
            >
              <EditorBubbleMenu>
                <EditorFormatBold hideName />
                <EditorFormatItalic hideName />
                <EditorFormatStrike hideName />
                <EditorFormatCode hideName />
                <Separator orientation="vertical" />
                <EditorNodeHeading1 hideName />
                <EditorNodeHeading2 hideName />
                <EditorNodeHeading3 hideName />
                <Separator orientation="vertical" />
                <EditorNodeBulletList hideName />
                <EditorNodeOrderedList hideName />
                <EditorNodeTaskList hideName />
                <Separator orientation="vertical" />
                <EditorNodeQuote hideName />
                <EditorNodeCode hideName />
                <EditorLinkSelector />
                <Separator orientation="vertical" />
                <EditorClearFormatting hideName />
              </EditorBubbleMenu>
            </EditorProvider>
          </div>
        )}

        {/* Preview/Items View */}
        {(activeView === 'preview' || activeView === 'split') && (
          <div
            className={cn(
              'flex-1 overflow-auto bg-muted/10 p-4',
              activeView === 'split' && 'w-1/2'
            )}
          >
            <PersonalListItems />
          </div>
        )}
      </div>
    </div>
  )
}
