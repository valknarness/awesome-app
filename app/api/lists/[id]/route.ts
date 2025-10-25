import { NextRequest, NextResponse } from 'next/server'
import { getRepositoriesByList, getAwesomeLists } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const listId = parseInt(id, 10)

    if (isNaN(listId)) {
      return NextResponse.json(
        { error: 'Invalid list ID' },
        { status: 400 }
      )
    }

    // Get the list info
    const lists = getAwesomeLists()
    const list = lists.find(l => l.id === listId)

    if (!list) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      )
    }

    // Parse pagination
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = (page - 1) * limit

    // Get repositories
    const repositories = getRepositoriesByList(listId, limit, offset)

    return NextResponse.json({
      list,
      repositories
    })
  } catch (error) {
    console.error('List detail API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
