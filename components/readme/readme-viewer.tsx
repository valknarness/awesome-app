'use client'

import * as React from 'react'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

interface ReadmeViewerProps {
  content: string
}

export function ReadmeViewer({ content }: ReadmeViewerProps) {
  const [html, setHtml] = React.useState('')

  React.useEffect(() => {
    const marked = new Marked(
      markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        },
      })
    )

    // Configure marked options
    marked.setOptions({
      gfm: true,
      breaks: true,
    })

    // Parse markdown
    const parseMarkdown = async () => {
      const result = await marked.parse(content)
      setHtml(result)
    }
    parseMarkdown()
  }, [content])

  return (
    <article
      className="prose prose-lg dark:prose-invert max-w-none prose-headings:gradient-text prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-pre:rounded-lg prose-pre:border prose-pre:border-primary/20 prose-pre:bg-muted/50 prose-img:rounded-lg prose-hr:border-primary/20"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
