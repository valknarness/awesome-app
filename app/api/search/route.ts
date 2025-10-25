import { NextRequest, NextResponse } from 'next/server'
import { searchRepositories } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    // Parse pagination
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const offset = (page - 1) * limit

    // Parse filters
    const language = searchParams.get('language') || undefined
    const category = searchParams.get('category') || undefined
    const minStars = searchParams.get('minStars')
      ? parseInt(searchParams.get('minStars')!, 10)
      : undefined
    const sortBy = (searchParams.get('sortBy') || 'relevance') as 'relevance' | 'stars' | 'recent'

    // Perform search
    const results = searchRepositories({
      query,
      limit,
      offset,
      language,
      minStars,
      category,
      sortBy
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
