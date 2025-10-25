import { NextRequest, NextResponse } from 'next/server'
import { getAwesomeLists, getCategories } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || undefined

    const lists = getAwesomeLists(category)
    const categories = getCategories()

    return NextResponse.json({
      lists,
      categories,
      total: lists.length
    })
  } catch (error) {
    console.error('Lists API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
