'use client';

import { QuizResult } from '@/lib/types';
import { formatTime } from '@/lib/quiz-utils';
import { Trophy, CheckCircle, XCircle, MinusCircle, Clock, Share2, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface ResultDashboardProps {
  result: QuizResult;
  onRetry?: () => void;
}

export default function ResultDashboard({ result, onRetry }: ResultDashboardProps) {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-400';
    if (grade.startsWith('B')) return 'text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-400';
    if (grade.startsWith('D')) return 'text-orange-400';
    return 'text-red-400';
  };

  const getGradeBg = (grade: string) => {
    if (grade.startsWith('A')) return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
    if (grade.startsWith('B')) return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
    if (grade.startsWith('C')) return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
    return 'from-red-500/20 to-rose-500/20 border-red-500/30';
  };

  const getScoreMessage = (pct: number) => {
    if (pct >= 90) return 'Outstanding! 🎉';
    if (pct >= 80) return 'Excellent work! 👏';
    if (pct >= 70) return 'Good job! 💪';
    if (pct >= 60) return 'Not bad! Keep it up! 📚';
    if (pct >= 50) return 'You can do better! 🔄';
    return 'Keep studying! 💡';
  };

  const handleShare = () => {
    const text = `I scored ${result.score}/${result.totalQuestions} (${result.percentage}%) - Grade: ${result.grade} on the ${result.chapterTitle} quiz! 🎯 #AIQuiz`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Result copied to clipboard!'));
    }
  };

  const stats = [
    {
      label: 'Correct',
      value: result.correctAnswers,
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20',
    },
    {
      label: 'Wrong',
      value: result.wrongAnswers,
      icon: XCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10 border-red-500/20',
    },
    {
      label: 'Skipped',
      value: result.skipped,
      icon: MinusCircle,
      color: 'text-gray-400',
      bg: 'bg-gray-500/10 border-gray-500/20',
    },
    {
      label: 'Time',
      value: formatTime(result.timeTaken),
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Main Score Card */}
      <div className={`relative bg-gradient-to-br ${getGradeBg(result.grade)} border rounded-2xl p-8 text-center overflow-hidden`}>
        <div className="absolute top-4 right-4 opacity-10">
          <Trophy className="w-24 h-24" />
        </div>

        <div className="relative">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-400" />

          <h2 className="text-2xl font-bold text-white mb-1">
            {getScoreMessage(result.percentage)}
          </h2>
          <p className="text-gray-400 text-sm mb-6">{result.chapterTitle}</p>

          {/* Score */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <div>
              <div className="text-6xl font-black text-white">
                {result.score}
                <span className="text-3xl text-gray-500">/{result.totalQuestions}</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">Total Score</p>
            </div>

            <div className="w-px h-16 bg-gray-700" />

            <div>
              <div className={`text-6xl font-black ${getGradeColor(result.grade)}`}>
                {result.grade}
              </div>
              <p className="text-gray-400 text-sm mt-1">Grade</p>
            </div>
          </div>

          {/* Percentage bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Score Percentage</span>
              <span className="text-white font-semibold">{result.percentage}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  result.percentage >= 70 ? 'bg-green-500' :
                  result.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} border rounded-xl p-4 text-center`}>
            <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-gray-500 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl hover:bg-green-500/20 transition-all font-semibold text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Quiz
          </button>
        )}
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/20 transition-all font-semibold text-sm"
        >
          <Share2 className="w-4 h-4" />
          Share Result
        </button>
        <Link
          href="/chapters"
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-700 transition-all font-semibold text-sm"
        >
          All Chapters
        </Link>
      </div>
    </div>
  );
}
