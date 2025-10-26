import Database from 'better-sqlite3'
import { join } from 'path'
import { existsSync } from 'fs'

// Database path - using user's .awesome directory
const DB_PATH = process.env.AWESOME_DB_PATH || join(process.env.HOME || '', '.awesome', 'awesome.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    // Check if database file exists before trying to open it
    if (!existsSync(DB_PATH)) {
      throw new Error(`Database file not found at ${DB_PATH}`)
    }
    db = new Database(DB_PATH, { readonly: true })
    // Enable WAL mode for better concurrency
    db.pragma('journal_mode = WAL')
  }
  return db
}

export interface AwesomeList {
  id: number
  name: string
  url: string
  description: string | null
  category: string | null
  stars: number | null
  forks: number | null
  last_commit: string | null
  level: number | null
  parent_id: number | null
  added_at: string | null
  last_updated: string | null
}

export interface Repository {
  id: number
  awesome_list_id: number
  name: string
  url: string
  description: string | null
  stars: number | null
  forks: number | null
  watchers: number | null
  language: string | null
  topics: string | null
  last_commit: string | null
  created_at: string | null
  added_at: string | null
}

export interface Readme {
  id: number
  repository_id: number
  content: string | null
  raw_content: string | null
  version_hash: string | null
  indexed_at: string | null
}

export interface SearchResult {
  repository_id: number
  repository_name: string
  repository_url: string
  description: string | null
  stars: number | null
  language: string | null
  topics: string | null
  awesome_list_name: string | null
  awesome_list_category: string | null
  rank: number
  snippet: string | null
}

export interface SearchOptions {
  query: string
  limit?: number
  offset?: number
  language?: string
  minStars?: number
  category?: string
  sortBy?: 'relevance' | 'stars' | 'recent'
}

export interface PaginatedResults<T> {
  results: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Full-text search using FTS5
 */
export function searchRepositories(options: SearchOptions): PaginatedResults<SearchResult> {
  const db = getDb()
  const {
    query,
    limit = 20,
    offset = 0,
    language,
    minStars,
    category,
    sortBy = 'relevance'
  } = options

  // Build FTS query
  const ftsQuery = query
    .trim()
    .split(/\s+/)
    .map(term => `"${term}"*`)
    .join(' OR ')

  let sql = `
    SELECT
      r.id as repository_id,
      r.name as repository_name,
      r.url as repository_url,
      r.description,
      r.stars,
      r.language,
      r.topics,
      al.name as awesome_list_name,
      al.category as awesome_list_category,
      fts.rank,
      snippet(readmes_fts, 2, '<mark>', '</mark>', '...', 32) as snippet
    FROM readmes_fts fts
    JOIN repositories r ON fts.rowid = r.id
    LEFT JOIN awesome_lists al ON r.awesome_list_id = al.id
    WHERE readmes_fts MATCH ?
  `

  const params: any[] = [ftsQuery]

  // Add filters
  if (language) {
    sql += ` AND r.language = ?`
    params.push(language)
  }

  if (minStars !== undefined) {
    sql += ` AND r.stars >= ?`
    params.push(minStars)
  }

  if (category) {
    sql += ` AND al.category = ?`
    params.push(category)
  }

  // Add sorting
  switch (sortBy) {
    case 'stars':
      sql += ` ORDER BY r.stars DESC, fts.rank`
      break
    case 'recent':
      sql += ` ORDER BY r.last_commit DESC, fts.rank`
      break
    default:
      sql += ` ORDER BY fts.rank`
  }

  // Count total results (use [\s\S]*? for multiline matching)
  const countSql = sql.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM')
    .replace(/ORDER BY[\s\S]*$/, '')
  const totalResult = db.prepare(countSql).get(...params) as { total: number }
  const total = totalResult.total

  // Add pagination
  sql += ` LIMIT ? OFFSET ?`
  params.push(limit, offset)

  const results = db.prepare(sql).all(...params) as SearchResult[]

  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  return {
    results,
    total,
    page,
    pageSize: limit,
    totalPages
  }
}

/**
 * Get all awesome lists with optional category filter
 */
export function getAwesomeLists(category?: string): AwesomeList[] {
  const db = getDb()

  let sql = `
    SELECT * FROM awesome_lists
    WHERE 1=1
  `
  const params: any[] = []

  if (category) {
    sql += ` AND category = ?`
    params.push(category)
  }

  sql += ` ORDER BY stars DESC, name ASC`

  return db.prepare(sql).all(...params) as AwesomeList[]
}

/**
 * Get repositories by awesome list ID
 */
export function getRepositoriesByList(listId: number, limit = 50, offset = 0): PaginatedResults<Repository> {
  const db = getDb()

  const countSql = `SELECT COUNT(*) as total FROM repositories WHERE awesome_list_id = ?`
  const totalResult = db.prepare(countSql).get(listId) as { total: number }
  const total = totalResult.total

  const sql = `
    SELECT * FROM repositories
    WHERE awesome_list_id = ?
    ORDER BY stars DESC, name ASC
    LIMIT ? OFFSET ?
  `

  const results = db.prepare(sql).all(listId, limit, offset) as Repository[]

  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  return {
    results,
    total,
    page,
    pageSize: limit,
    totalPages
  }
}

/**
 * Get repository by ID with README content
 */
export function getRepositoryWithReadme(repositoryId: number): (Repository & { readme: Readme | null }) | null {
  const db = getDb()

  const repo = db.prepare(`
    SELECT * FROM repositories WHERE id = ?
  `).get(repositoryId) as Repository | undefined

  if (!repo) {
    return null
  }

  const readme = db.prepare(`
    SELECT raw_content as content FROM readmes WHERE repository_id = ?
  `).get(repositoryId) as Readme | undefined

  return {
    ...repo,
    readme: readme || null
  }
}

/**
 * Get all unique categories
 */
export function getCategories(): { name: string; count: number }[] {
  const db = getDb()

  return db.prepare(`
    SELECT
      category as name,
      COUNT(*) as count
    FROM awesome_lists
    WHERE category IS NOT NULL
    GROUP BY category
    ORDER BY count DESC, category ASC
  `).all() as { name: string; count: number }[]
}

/**
 * Get all unique languages
 */
export function getLanguages(): { name: string; count: number }[] {
  const db = getDb()

  return db.prepare(`
    SELECT
      language as name,
      COUNT(*) as count
    FROM repositories
    WHERE language IS NOT NULL
    GROUP BY language
    ORDER BY count DESC, language ASC
    LIMIT 50
  `).all() as { name: string; count: number }[]
}

/**
 * Get database statistics
 */
export function getStats() {
  const db = getDb()

  const stats = {
    lists: db.prepare('SELECT COUNT(*) as count FROM awesome_lists').get() as { count: number },
    repositories: db.prepare('SELECT COUNT(*) as count FROM repositories').get() as { count: number },
    readmes: db.prepare('SELECT COUNT(*) as count FROM readmes').get() as { count: number },
    lastUpdated: db.prepare('SELECT MAX(last_updated) as date FROM awesome_lists').get() as { date: string | null }
  }

  return {
    totalLists: stats.lists.count,
    totalRepositories: stats.repositories.count,
    totalReadmes: stats.readmes.count,
    lastUpdated: stats.lastUpdated.date
  }
}

/**
 * Get trending repositories (most stars)
 */
export function getTrendingRepositories(limit = 10): Repository[] {
  const db = getDb()

  return db.prepare(`
    SELECT * FROM repositories
    WHERE stars IS NOT NULL
    ORDER BY stars DESC
    LIMIT ?
  `).all(limit) as Repository[]
}
