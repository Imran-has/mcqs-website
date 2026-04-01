import { CHAPTERS } from '@/lib/chapters';
import ChapterCard from '@/components/ChapterCard';
import { BookOpen } from 'lucide-react';

export default function ChaptersPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-12">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
            <BookOpen className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">
              Select Chapter
            </span>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Choose Your Chapter
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Questions are generated live from the source documentation.
            Each session gives you a fresh set of questions.
          </p>
        </div>

        {/* Chapter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CHAPTERS.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-10 bg-gray-900/60 border border-gray-800 rounded-xl p-5 flex items-start gap-4">
          <div className="w-8 h-8 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-green-400 text-sm">ℹ</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold mb-1">Live Content Fetching</p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Questions are dynamically generated from Panaversity documentation.
              Content is cached for 1 hour to optimize performance.
              First load may take a few seconds while content is fetched.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
