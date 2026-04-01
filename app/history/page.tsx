'use client';

import { useEffect, useState } from 'react';
import { QuizResult } from '@/lib/types';
import { getResults, formatTime } from '@/lib/quiz-utils';
import { Trophy, CheckCircle, XCircle, MinusCircle, Clock, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    setResults(getResults());
  }, []);

  const clearHistory = () => {
    if (confirm('Clear all quiz history?')) {
      localStorage.removeItem('quiz_results');
      setResults([]);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-400';
    if (grade.startsWith('B')) return 'text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPercentageColor = (pct: number) => {
    if (pct >= 70) return 'bg-green-500';
    if (pct >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-black px-4 py-12">
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h1 className="text-2xl font-black text-white">Quiz History</h1>
            </div>
            <p className="text-gray-500 text-sm">{results.length} quiz{results.length !== 1 ? 'zes' : ''} completed</p>
          </div>
          {results.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Empty state */}
        {results.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">No Quizzes Yet</h3>
            <p className="text-gray-500 text-sm mb-6">Complete a quiz to see your results here</p>
            <Link
              href="/chapters"
              className="inline-flex items-center gap-2 bg-green-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-green-400 transition-colors"
            >
              Start a Quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Results list */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`text-3xl font-black ${getGradeColor(result.grade)}`}>
                      {result.grade}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{result.chapterTitle}</p>
                      <p className="text-gray-500 text-xs">
                        {result.score}/{result.totalQuestions} correct · {result.percentage}%
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-800 rounded-full h-1.5 mb-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getPercentageColor(result.percentage)} transition-all`}
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      {result.correctAnswers} correct
                    </span>
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      {result.wrongAnswers} wrong
                    </span>
                    <span className="flex items-center gap-1">
                      <MinusCircle className="w-3.5 h-3.5 text-gray-500" />
                      {result.skipped} skipped
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      {formatTime(result.timeTaken)}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/quiz/${result.chapterId}`}
                  className="flex items-center gap-1 text-green-400 hover:text-green-300 text-sm font-medium transition-colors flex-shrink-0"
                >
                  Retry
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {results.length > 0 && (
          <div className="mt-6 text-center">
            <Link
              href="/chapters"
              className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 font-semibold px-6 py-3 rounded-xl hover:bg-green-500/20 transition-all text-sm"
            >
              Take Another Quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
