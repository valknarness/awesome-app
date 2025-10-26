# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Awesome Web** is a Next.js 15 web application for browsing and searching "awesome lists" from GitHub. It features full-text search powered by SQLite FTS5, personal list management with a rich markdown editor, and automated database builds via GitHub Actions.

**Tech Stack:**
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4 with custom theme (purple/pink/gold gradients)
- shadcn/ui components (New York style)
- SQLite3 with better-sqlite3 + FTS5 for full-text search
- Zustand for state management
- TipTap for WYSIWYG markdown editing
- Node.js 22+ required

## Common Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Architecture Overview

### Database Layer (`lib/db.ts`)

Central database abstraction for SQLite operations:
- **Connection Management**: Singleton pattern with WAL mode for concurrency
- **Database Path**: `$AWESOME_DB_PATH` or `~/.awesome/awesome.db` (from awesome CLI)
- **Core Functions**:
  - `searchRepositories()` - FTS5 full-text search with faceted filtering (language, stars, category)
  - `getAwesomeLists()` - Hierarchical list of awesome lists
  - `getRepositoryWithReadme()` - Fetch repository details with README content
  - `getCategories()` / `getLanguages()` - Facet data for filters
  - `getStats()` - Database statistics for homepage

**Search Architecture**: Uses SQLite FTS5 with `readmes_fts` virtual table. Queries are parsed into FTS format (`"term1"* OR "term2"*`) and support sorting by relevance, stars, or recent activity.

### Personal List Management (`lib/personal-list-store.ts`)

Zustand store with localStorage persistence for user-curated lists:
- **Items Management**: CRUD operations for saved repositories/resources
- **Markdown Sync**: Bidirectional sync between structured items and markdown representation
- **Editor Integration**: State for TipTap editor (view modes: editor/preview/split)
- **Export/Import**: JSON export and markdown generation

### API Routes (`app/api/*`)

- `/api/search` - Repository search endpoint (wraps `lib/db.ts`)
- `/api/repositories/[id]` - Single repository details
- `/api/lists` - User personal lists CRUD
- `/api/lists/[id]` - Single list operations
- `/api/stats` - Database statistics
- `/api/db-version` - Database version for cache invalidation
- `/api/webhook` - GitHub Actions webhook for database update notifications

### Component Structure

**Layout Components** (`components/layout/`):
- `app-header.tsx` - Main navigation with command menu trigger
- `app-sidebar.tsx` - Tree navigation for awesome lists hierarchy
- `command-menu.tsx` - Global search command palette (Cmd+K)

**Personal List Components** (`components/personal-list/`):
- `personal-list-editor.tsx` - TipTap-based markdown editor with rich formatting
- `push-to-list-button.tsx` - "Add to list" button for repositories
- `sliding-panel.tsx` - Side panel for personal list management
- `personal-list-items.tsx` - Structured view of saved items

**README Viewer** (`components/readme/`):
- `readme-viewer.tsx` - Markdown rendering with syntax highlighting (marked + highlight.js)
- `readme-header.tsx` - Repository metadata header (stars, language, actions)

**UI Components** (`components/ui/`):
- shadcn/ui components (New York style)
- Custom `kbd.tsx` for keyboard shortcut displays

### Theme System

Custom Tailwind theme matching the awesome CLI branding:
- **Primary Colors**: `--awesome-purple: #DA22FF`, `--awesome-pink: #FF69B4`, `--awesome-gold: #FFD700`
- **Gradients**: Utility classes for purple-to-gold gradients (buttons, text, backgrounds)
- **Dark Mode**: Next-themes integration with system preference detection
- **Typography**: Tailwind typography plugin for markdown rendering

Configuration in `tailwind.config.ts` and `app/globals.css`.

### Database Build System

**Automated Builds** (`.github/workflows/db.yml`):
- Runs every 6 hours or manual trigger
- Two modes:
  1. **Download mode** (default, ~5 min): Downloads pre-built DB from `valknarness/awesome` repository
  2. **Build mode** (~1-2 hours): Clones awesome CLI and runs full indexing
- Artifacts retained for 90 days with metadata JSON

**Build Script** (`scripts/build-db.js`):
- Uses GitHub CLI to download artifacts or spawns awesome CLI indexer
- Generates `db-metadata.json` with build stats
- Fallback to local build if download fails

### Page Routes

- `/` - Landing page with statistics and featured lists
- `/browse` - Browse all awesome lists
- `/search` - Search interface with faceted filtering
- `/list/[id]` - Single awesome list view with repositories
- `/repository/[id]` - Repository detail with README
- `/readme/[owner]/[repo]` - Direct README viewer
- `/my-list` - Personal list editor
- `/legal`, `/disclaimer`, `/imprint` - Legal pages

## Important Development Notes

### Database Schema Expectations

The SQLite database must have these tables:
- `awesome_lists` - List metadata (id, name, url, description, category, stars, parent_id, level)
- `repositories` - Repository data (id, awesome_list_id, name, url, description, stars, language, topics)
- `readmes` - README content (id, repository_id, raw_content)
- `readmes_fts` - FTS5 virtual table for full-text search

### Path Aliases

- `@/` maps to project root
- `@/components` - React components
- `@/lib` - Utilities and shared logic
- `@/hooks` - Custom React hooks
- `@/app` - Next.js app router pages

### Service Worker

`public/worker.js` implements background polling for database updates:
- Polls `/api/db-version` with exponential backoff
- Notifies client on version change for cache invalidation
- Smart polling reduces when page inactive

### Node.js Version

Requires Node.js 22+ (specified in `package.json` engines). Use pnpm for package management.

### shadcn/ui Components

Components use "New York" style variant. When adding new shadcn components, ensure they match the custom theme colors defined in `components.json` and `app/globals.css`.

### Adding New Search Filters

When extending search functionality:
1. Update `SearchOptions` interface in `lib/db.ts`
2. Add filter logic to SQL query in `searchRepositories()`
3. Update API route in `app/api/search/route.ts`
4. Add UI controls in search page components

### TipTap Editor Extensions

The personal list editor uses these TipTap extensions:
- Starter Kit (basic formatting)
- Code Block Lowlight (syntax highlighting)
- Table extensions (table support)
- Task List/Item (checklist support)
- Character Count (word count display)
- Typography (smart quotes, em dashes)

When modifying the editor, ensure all extensions are properly configured in `personal-list-editor.tsx`.
