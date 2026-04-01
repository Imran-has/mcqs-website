import { NextRequest, NextResponse } from 'next/server';
import { fetchAndParseContent } from '@/lib/scraper';
import { generateMCQs } from '@/lib/mcq-generator';
import { CHAPTERS } from '@/lib/chapters';

// In-memory cache to avoid re-fetching on every request
const cache = new Map<string, { questions: ReturnType<typeof generateMCQs>; timestamp: number }>();
const CACHE_TTL = 3600 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chapterId = searchParams.get('chapterId');
  const count = parseInt(searchParams.get('count') || '15');
  const difficulty = searchParams.get('difficulty') || 'all';
  const forceRefresh = searchParams.get('refresh') === 'true';

  if (!chapterId) {
    return NextResponse.json({ error: 'chapterId is required' }, { status: 400 });
  }

  const chapter = CHAPTERS.find(c => c.id === chapterId);
  if (!chapter) {
    return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
  }

  const cacheKey = `${chapterId}_${count}`;
  const cached = cache.get(cacheKey);
  const isCacheValid = cached && (Date.now() - cached.timestamp < CACHE_TTL) && !forceRefresh;

  let questions;

  if (isCacheValid) {
    questions = cached.questions;
  } else {
    try {
      const content = await fetchAndParseContent(chapter.url);
      questions = generateMCQs(content, chapterId, Math.min(count, 20));
      cache.set(cacheKey, { questions, timestamp: Date.now() });
    } catch (error) {
      console.error('Failed to generate MCQs:', error);
      return NextResponse.json(
        { error: 'Failed to generate questions', details: String(error) },
        { status: 500 }
      );
    }
  }

  // Filter by difficulty if specified
  const filtered = difficulty === 'all'
    ? questions
    : questions.filter(q => q.difficulty === difficulty);

  // Shuffle for random quiz experience
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);

  return NextResponse.json({
    success: true,
    chapterId,
    chapterTitle: chapter.subtitle,
    questions: shuffled,
    total: shuffled.length,
    cached: isCacheValid,
  });
}
