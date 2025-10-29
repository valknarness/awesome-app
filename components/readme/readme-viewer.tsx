'use client'

import * as React from 'react'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

interface ReadmeViewerProps {
  content: string
  repositoryUrl?: string
}

export function ReadmeViewer({ content, repositoryUrl }: ReadmeViewerProps) {
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

    // Custom renderer to fix relative image URLs
    if (repositoryUrl) {
      const renderer = {
        image(href: string, title: string | null, text: string) {
          let imgSrc = href

          // Convert GitHub URLs to raw content URLs
          if (repositoryUrl.includes('github.com')) {
            const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
            if (match) {
              const [, owner, repo] = match
              const cleanRepo = repo.replace(/\.git$/, '')

              // Handle relative URLs
              if (!imgSrc.startsWith('http://') && !imgSrc.startsWith('https://') && !imgSrc.startsWith('//')) {
                // Remove leading ./
                imgSrc = imgSrc.replace(/^\.\//, '')
                // Build raw GitHub URL (main/master branch assumed)
                imgSrc = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/master/${imgSrc}`
              }
              // Handle GitHub blob URLs - convert to raw
              else if (imgSrc.includes('github.com') && imgSrc.includes('/blob/')) {
                imgSrc = imgSrc.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/')
              }
            }
          }

          const titleAttr = title ? ` title="${title}"` : ''

          // Check if it's a badge (shields.io, badgen, etc.)
          const isBadge = imgSrc.includes('shields.io') ||
                         imgSrc.includes('badgen.net') ||
                         imgSrc.includes('badge') ||
                         imgSrc.includes('img.shields') ||
                         imgSrc.match(/\/badges?\//)

          if (isBadge) {
            return `<img src="${imgSrc}" alt="${text}" ${titleAttr} class="inline-block !my-0 !mx-1 align-middle" />`
          }

          return `<img src="${imgSrc}" alt="${text}" ${titleAttr} />`
        }
      }
      marked.use({ renderer })
    }

    // Parse markdown
    const parseMarkdown = async () => {
      const result = await marked.parse(content)
      setHtml(result)
    }
    parseMarkdown()
  }, [content, repositoryUrl])

  return (
    <article
      className="prose prose-lg dark:prose-invert max-w-none prose-headings:gradient-text prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-pre:rounded-lg prose-pre:border prose-pre:border-primary/20 prose-pre:bg-muted/50 prose-img:rounded-lg prose-hr:border-primary/20"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
