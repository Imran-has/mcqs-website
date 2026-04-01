'use client';

import Link from 'next/link';
import { Chapter } from '@/lib/types';
import { ArrowRight, BookOpen } from 'lucide-react';

interface ChapterCardProps {
  chapter: Chapter;
  questionCount?: number;
}

export default function ChapterCard({ chapter, questionCount }: ChapterCardProps) {
  return (
    <div className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1">
      {/* Top gradient strip */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${chapter.color}`} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${chapter.color} flex items-center justify-center text-2xl shadow-lg`}>
              {chapter.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-green-400 uppercase tracking-widest">
                {chapter.title}
              </p>
              <h3 className="text-white font-bold text-lg leading-tight mt-0.5">
                {chapter.subtitle}
              </h3>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          {chapter.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <BookOpen className="w-3.5 h-3.5 text-green-500" />
            <span>{questionCount ?? '10-20'} questions</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>AI Generated</span>
          </div>
        </div>

        {/* Difficulty badges */}
        <div className="flex gap-2 mb-5">
          {['easy', 'medium', 'hard'].map((level) => (
            <span
              key={level}
              className="text-xs px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 capitalize border border-gray-700"
            >
              {level}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/quiz/${chapter.id}`}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r ${chapter.color} text-white font-semibold text-sm hover:opacity-90 transition-opacity group-hover:shadow-md`}
        >
          Start Quiz
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
