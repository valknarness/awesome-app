'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PersonalListItem {
  id: string
  title: string
  description: string
  url: string
  repository?: string
  addedAt: number
  tags?: string[]
  category?: string
}

export interface PersonalListState {
  items: PersonalListItem[]
  markdown: string
  isEditorOpen: boolean
  activeView: 'editor' | 'preview' | 'split'

  // Actions
  addItem: (item: Omit<PersonalListItem, 'id' | 'addedAt'>) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<PersonalListItem>) => void
  setMarkdown: (markdown: string) => void
  toggleEditor: () => void
  openEditor: () => void
  closeEditor: () => void
  setActiveView: (view: 'editor' | 'preview' | 'split') => void
  clearList: () => void
  importList: (items: PersonalListItem[]) => void
  exportList: () => PersonalListItem[]
  generateMarkdown: () => string
  syncMarkdownToItems: () => void
}

const DEFAULT_MARKDOWN = `# My Awesome List

> A curated list of my favorite resources, tools, and projects.

## Contents

- [Getting Started](#getting-started)
- [Resources](#resources)

## Getting Started

Start adding items to your personal awesome list by clicking the "Push to my list" button on any repository or resource you find interesting!

## Resources

`

export const usePersonalListStore = create<PersonalListState>()(
  persist(
    (set, get) => ({
      items: [],
      markdown: DEFAULT_MARKDOWN,
      isEditorOpen: false,
      activeView: 'split',

      addItem: (itemData) => {
        const newItem: PersonalListItem = {
          ...itemData,
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          addedAt: Date.now(),
        }

        set((state) => {
          const newItems = [...state.items, newItem]
          return {
            items: newItems,
            markdown: generateMarkdownFromItems(newItems, state.markdown),
          }
        })
      },

      removeItem: (id) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id)
          return {
            items: newItems,
            markdown: generateMarkdownFromItems(newItems, state.markdown),
          }
        })
      },

      updateItem: (id, updates) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          )
          return {
            items: newItems,
            markdown: generateMarkdownFromItems(newItems, state.markdown),
          }
        })
      },

      setMarkdown: (markdown) => {
        set({ markdown })
      },

      toggleEditor: () => {
        set((state) => ({ isEditorOpen: !state.isEditorOpen }))
      },

      openEditor: () => {
        set({ isEditorOpen: true })
      },

      closeEditor: () => {
        set({ isEditorOpen: false })
      },

      setActiveView: (view) => {
        set({ activeView: view })
      },

      clearList: () => {
        set({ items: [], markdown: DEFAULT_MARKDOWN })
      },

      importList: (items) => {
        set({
          items,
          markdown: generateMarkdownFromItems(items, DEFAULT_MARKDOWN),
        })
      },

      exportList: () => {
        return get().items
      },

      generateMarkdown: () => {
        const items = get().items
        return generateMarkdownFromItems(items, get().markdown)
      },

      syncMarkdownToItems: () => {
        // This would parse markdown back to items - for now, we'll keep it simple
        // and prioritize items as source of truth
        const items = get().items
        set({ markdown: generateMarkdownFromItems(items, get().markdown) })
      },
    }),
    {
      name: 'personal-awesome-list',
      version: 1,
    }
  )
)

// Helper function to generate markdown from items
function generateMarkdownFromItems(
  items: PersonalListItem[],
  currentMarkdown: string
): string {
  if (items.length === 0) {
    return DEFAULT_MARKDOWN
  }

  // Group items by category
  const categorized = items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, PersonalListItem[]>)

  // Build markdown
  let markdown = `# My Awesome List\n\n`
  markdown += `> A curated list of my favorite resources, tools, and projects.\n\n`

  // Table of contents
  markdown += `## Contents\n\n`
  Object.keys(categorized).forEach((category) => {
    const slug = category.toLowerCase().replace(/\s+/g, '-')
    markdown += `- [${category}](#${slug})\n`
  })
  markdown += `\n`

  // Categories and items
  Object.entries(categorized).forEach(([category, categoryItems]) => {
    markdown += `## ${category}\n\n`

    categoryItems.forEach((item) => {
      markdown += `### [${item.title}](${item.url})\n\n`
      markdown += `${item.description}\n\n`

      if (item.repository) {
        markdown += `**Repository:** \`${item.repository}\`\n\n`
      }

      if (item.tags && item.tags.length > 0) {
        markdown += `**Tags:** ${item.tags.map(tag => `\`${tag}\``).join(', ')}\n\n`
      }
    })
  })

  markdown += `---\n\n`
  markdown += `*Generated with [Awesome](https://awesome.com) 💜💗💛*\n`

  return markdown
}
