export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: MCQOption[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  chapterId: string;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  description: string;
  color: string;
  icon: string;
  questionCount?: number;
}

export interface QuizState {
  chapterId: string;
  questions: MCQ[];
  currentIndex: number;
  answers: Record<string, string>;
  startTime: number;
  endTime?: number;
}

export interface QuizResult {
  chapterId: string;
  chapterTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  score: number;
  percentage: number;
  grade: string;
  timeTaken: number;
  answers: Record<string, string>;
  questions: MCQ[];
}
