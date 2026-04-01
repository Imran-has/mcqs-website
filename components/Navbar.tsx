'use client';

import Link from 'next/link';
import { Brain, Home, BookOpen, Trophy } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-400 transition-colors">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-white font-bold text-lg">
              <span className="text-green-400">AI</span>Quiz
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all text-sm"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link
              href="/chapters"
              className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Chapters</span>
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all text-sm"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
