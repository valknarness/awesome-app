import { NextRequest, NextResponse } from 'next/server'
import { getRepositoryWithReadme } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const repositoryId = parseInt(id, 10)

    if (isNaN(repositoryId)) {
      return NextResponse.json(
        { error: 'Invalid repository ID' },
        { status: 400 }
      )
    }

    const repository = getRepositoryWithReadme(repositoryId)

    if (!repository) {
      return NextResponse.json(
        { error: 'Repository not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(repository)
  } catch (error) {
    console.error('Repository API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
