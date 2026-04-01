import { QuizResult, MCQ } from './types';

export function calculateGrade(percentage: number): string {
  if (percentage >= 95) return 'A+';
  if (percentage >= 90) return 'A';
  if (percentage >= 85) return 'A-';
  if (percentage >= 80) return 'B+';
  if (percentage >= 75) return 'B';
  if (percentage >= 70) return 'B-';
  if (percentage >= 65) return 'C+';
  if (percentage >= 60) return 'C';
  if (percentage >= 55) return 'C-';
  if (percentage >= 50) return 'D';
  return 'F';
}

export function calculateResult(
  questions: MCQ[],
  answers: Record<string, string>,
  chapterId: string,
  chapterTitle: string,
  startTime: number
): QuizResult {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;

  for (const q of questions) {
    const answer = answers[q.id];
    if (!answer) {
      skipped++;
    } else if (answer === q.correctAnswer) {
      correct++;
    } else {
      wrong++;
    }
  }

  const total = questions.length;
  const score = correct;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    chapterId,
    chapterTitle,
    totalQuestions: total,
    correctAnswers: correct,
    wrongAnswers: wrong,
    skipped,
    score,
    percentage,
    grade: calculateGrade(percentage),
    timeTaken: Math.round((Date.now() - startTime) / 1000),
    answers,
    questions,
  };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function saveResult(result: QuizResult): void {
  if (typeof window === 'undefined') return;
  const existing = getResults();
  existing.unshift(result);
  // Keep only last 10 results
  localStorage.setItem('quiz_results', JSON.stringify(existing.slice(0, 10)));
}

export function getResults(): QuizResult[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('quiz_results') || '[]');
  } catch {
    return [];
  }
}
