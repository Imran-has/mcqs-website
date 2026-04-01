'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MCQ } from '@/lib/types';
import { CHAPTERS } from '@/lib/chapters';
import { calculateResult, saveResult } from '@/lib/quiz-utils';
import ProgressBar from '@/components/ProgressBar';
import QuizQuestion from '@/components/QuizQuestion';
import ResultDashboard from '@/components/ResultDashboard';
import {
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  AlertCircle,
  Loader2,
  RotateCcw,
  Filter,
} from 'lucide-react';

type QuizPhase = 'config' | 'loading' | 'quiz' | 'result' | 'error';

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.chapterId as string;

  const chapter = CHAPTERS.find(c => c.id === chapterId);

  const [phase, setPhase] = useState<QuizPhase>('config');
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [result, setResult] = useState<ReturnType<typeof calculateResult> | null>(null);

  const loadQuestions = useCallback(async () => {
    setPhase('loading');
    setErrorMsg('');
    try {
      const res = await fetch(
        `/api/generate-mcqs?chapterId=${chapterId}&count=${questionCount}&difficulty=${difficulty}&refresh=true`
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to load questions');
      }
      if (data.questions.length === 0) {
        throw new Error('No questions could be generated from the content. Please try again.');
      }
      setQuestions(data.questions);
      setCurrentIndex(0);
      setAnswers({});
      setShowAnswer(false);
      setStartTime(Date.now());
      setPhase('quiz');
    } catch (err) {
      setErrorMsg(String(err));
      setPhase('error');
    }
  }, [chapterId, questionCount, difficulty]);

  const handleAnswer = (optionText: string) => {
    if (showAnswer) return;
    const q = questions[currentIndex];
    setAnswers(prev => ({ ...prev, [q.id]: optionText }));
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowAnswer(!!answers[questions[currentIndex + 1]?.id]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setShowAnswer(!!answers[questions[currentIndex - 1]?.id]);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleSubmit = () => {
    const res = calculateResult(
      questions,
      answers,
      chapterId,
      chapter?.subtitle || chapterId,
      startTime
    );
    saveResult(res);
    setResult(res);
    setPhase('result');
  };

  const handleRetry = () => {
    setPhase('config');
    setResult(null);
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  if (!chapter) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Chapter Not Found</h2>
          <button onClick={() => router.push('/chapters')} className="text-green-400 hover:text-green-300">
            Back to chapters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/chapters')}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 transition-colors text-sm mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          All Chapters
        </button>

        {/* Chapter title */}
        <div className="mb-8">
          <p className="text-xs text-green-400 font-semibold uppercase tracking-widest mb-1">
            {chapter.title}
          </p>
          <h1 className="text-2xl font-black text-white">{chapter.subtitle}</h1>
        </div>

        {/* ===== CONFIG PHASE ===== */}
        {phase === 'config' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Configure Your Quiz</h2>
              <p className="text-gray-500 text-sm">Customize before you start</p>
            </div>

            {/* Number of questions */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Number of Questions
              </label>
              <div className="flex gap-2 flex-wrap">
                {[10, 15, 20].map(n => (
                  <button
                    key={n}
                    onClick={() => setQuestionCount(n)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      questionCount === n
                        ? 'bg-green-500 border-green-500 text-black'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-green-500/50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                <Filter className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                Difficulty
              </label>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all capitalize ${
                      difficulty === d
                        ? 'bg-green-500 border-green-500 text-black'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-green-500/50'
                    }`}
                  >
                    {d === 'all' ? 'All Levels' : d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={loadQuestions}
              className={`w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r ${chapter.color} text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
            >
              <span className="text-xl">{chapter.icon}</span>
              Start Quiz
            </button>
          </div>
        )}

        {/* ===== LOADING PHASE ===== */}
        {phase === 'loading' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <Loader2 className="w-12 h-12 text-green-400 animate-spin mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Generating Questions...</h3>
            <p className="text-gray-500 text-sm">
              Fetching live content from Panaversity docs and generating MCQs
            </p>
            <div className="mt-6 flex justify-center gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ===== ERROR PHASE ===== */}
        {phase === 'error' && (
          <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Failed to Load Questions</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
              {errorMsg}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={loadQuestions}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/20 transition-all text-sm font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </button>
              <button
                onClick={() => setPhase('config')}
                className="px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 transition-all text-sm font-semibold"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* ===== QUIZ PHASE ===== */}
        {phase === 'quiz' && currentQuestion && (
          <div className="space-y-5">
            {/* Progress */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <ProgressBar
                current={currentIndex + 1}
                total={questions.length}
                showLabel={true}
              />
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>{answeredCount} answered</span>
                <span className="text-yellow-500">{unansweredCount} remaining</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <QuizQuestion
                question={currentQuestion}
                selectedAnswer={answers[currentQuestion.id] || null}
                onAnswer={handleAnswer}
                showResult={showAnswer}
                questionNumber={currentIndex + 1}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl hover:text-white hover:border-gray-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {!showAnswer && (
                <button
                  onClick={handleSkip}
                  className="px-4 py-2.5 bg-gray-900 border border-gray-800 text-gray-500 rounded-xl hover:text-gray-300 transition-all text-sm"
                >
                  Skip
                </button>
              )}

              <div className="flex-1" />

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/20 transition-all text-sm font-medium"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className={`flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r ${chapter.color} text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity`}
                >
                  <CheckSquare className="w-4 h-4" />
                  Submit Quiz
                </button>
              )}
            </div>

            {/* Question dots */}
            <div className="flex flex-wrap gap-1.5 justify-center mt-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(i);
                    setShowAnswer(!!answers[q.id]);
                  }}
                  className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                    i === currentIndex
                      ? 'bg-green-500 text-black scale-110'
                      : answers[q.id]
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-800 text-gray-500 border border-gray-700 hover:border-gray-500'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Submit early button (if many answered) */}
            {answeredCount >= Math.ceil(questions.length * 0.5) && (
              <button
                onClick={handleSubmit}
                className="w-full py-3 border border-dashed border-gray-700 text-gray-500 rounded-xl hover:border-green-500/30 hover:text-green-400 transition-all text-sm"
              >
                Submit now ({answeredCount}/{questions.length} answered)
              </button>
            )}
          </div>
        )}

        {/* ===== RESULT PHASE ===== */}
        {phase === 'result' && result && (
          <ResultDashboard result={result} onRetry={handleRetry} />
        )}
      </div>
    </div>
  );
}
