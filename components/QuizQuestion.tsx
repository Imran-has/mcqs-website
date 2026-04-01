'use client';

import { MCQ, MCQOption } from '@/lib/types';
import { CheckCircle, XCircle, Circle } from 'lucide-react';

interface QuizQuestionProps {
  question: MCQ;
  selectedAnswer: string | null;
  onAnswer: (optionText: string) => void;
  showResult?: boolean;
  questionNumber: number;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswer,
  showResult = false,
  questionNumber,
}: QuizQuestionProps) {
  const getDifficultyColor = (d: string) => {
    if (d === 'easy') return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (d === 'medium') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const getOptionStyle = (option: MCQOption) => {
    if (!showResult) {
      if (selectedAnswer === option.text) {
        return 'border-green-500 bg-green-500/10 text-white';
      }
      return 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-green-500/50 hover:bg-gray-800 hover:text-white cursor-pointer';
    }

    if (option.text === question.correctAnswer) {
      return 'border-green-500 bg-green-500/20 text-green-300';
    }
    if (selectedAnswer === option.text && option.text !== question.correctAnswer) {
      return 'border-red-500 bg-red-500/20 text-red-300';
    }
    return 'border-gray-700 bg-gray-800/30 text-gray-500';
  };

  const getOptionIcon = (option: MCQOption) => {
    if (!showResult) {
      if (selectedAnswer === option.text) {
        return <div className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>;
      }
      return <Circle className="w-5 h-5 text-gray-600" />;
    }

    if (option.text === question.correctAnswer) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    if (selectedAnswer === option.text) {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    return <Circle className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="space-y-5">
      {/* Question header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Q{questionNumber}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Question text */}
      <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5">
        <p className="text-white text-base leading-relaxed font-medium">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => !showResult && onAnswer(option.text)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 ${getOptionStyle(option)}`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {getOptionIcon(option)}
            </div>
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xs font-bold text-gray-500 uppercase w-4 flex-shrink-0">
                {option.id.toUpperCase()}
              </span>
              <span className="text-sm leading-relaxed">{option.text}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Explanation (shown after answer) */}
      {showResult && question.explanation && selectedAnswer && (
        <div className="bg-gray-800/50 border border-green-500/20 rounded-xl p-4">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-1.5">
            Explanation
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
