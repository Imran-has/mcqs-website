import { NextRequest, NextResponse } from 'next/server';
import { fetchAndParseContent } from '@/lib/scraper';
import { CHAPTERS } from '@/lib/chapters';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chapterId = searchParams.get('chapterId');

  if (!chapterId) {
    return NextResponse.json({ error: 'chapterId is required' }, { status: 400 });
  }

  const chapter = CHAPTERS.find(c => c.id === chapterId);
  if (!chapter) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  try {
    const content = await fetchAndParseContent(chapter.url);
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content', details: String(error) },
      { status: 500 }
    );
  }
}
