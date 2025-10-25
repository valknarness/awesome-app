import { NextResponse } from 'next/server'
import { getStats, getLanguages, getCategories, getTrendingRepositories } from '@/lib/db'

export async function GET() {
  try {
    const stats = getStats()
    const languages = getLanguages()
    const categories = getCategories()
    const trending = getTrendingRepositories(10)

    return NextResponse.json({
      stats,
      languages,
      categories,
      trending
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
