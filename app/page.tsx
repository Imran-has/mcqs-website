import Link from 'next/link';
import { Brain, Zap, Target, Award, ChevronRight, BookOpen, Sparkles } from 'lucide-react';
import { CHAPTERS } from '@/lib/chapters';

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: 'AI-Generated Questions',
      description: 'Questions dynamically generated from live content — no hardcoded data.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20',
    },
    {
      icon: Target,
      title: 'Smart Difficulty',
      description: 'Easy, Medium, and Hard questions adapted to the content complexity.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: Award,
      title: 'Instant Grading',
      description: 'Real-time scoring with grade analysis: A+, A, B, C and beyond.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      icon: BookOpen,
      title: 'Chapter Progress',
      description: 'Track your performance across chapters with saved history.',
      color: 'text-green-400',
      bg: 'bg-green-500/10 border-green-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">
              AI-Powered Quiz Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
            Master{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              AI Agents
            </span>
            <br />
            With Smart Quizzes
          </h1>

          <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Dynamically generated MCQs from real documentation. Test your knowledge on
            Agent Factory, Markdown Instructions, and General Agents — powered by live content.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chapters"
              className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 text-base"
            >
              <Brain className="w-5 h-5" />
              Start Quiz
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-4 rounded-xl border border-gray-700 hover:border-gray-600 transition-all text-base"
            >
              <Award className="w-5 h-5 text-yellow-400" />
              View History
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative border-y border-gray-800 bg-gray-900/50 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
          {[
            { label: 'Chapters', value: '3' },
            { label: 'Questions', value: '45+' },
            { label: 'Topics', value: '∞' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-green-400">{value}</div>
              <div className="text-gray-500 text-sm mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Chapters Preview */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Available Chapters</h2>
            <p className="text-gray-500 text-sm">
              Content fetched live from Panaversity docs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CHAPTERS.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/quiz/${chapter.id}`}
                className="group bg-gray-900 border border-gray-800 hover:border-green-500/40 rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/5"
              >
                <div className={`h-1 w-full bg-gradient-to-r ${chapter.color} rounded-full mb-5`} />
                <div className="text-3xl mb-3">{chapter.icon}</div>
                <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-1">
                  {chapter.title}
                </p>
                <h3 className="text-white font-bold text-lg mb-2">{chapter.subtitle}</h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {chapter.description}
                </p>
                <div className="flex items-center gap-1.5 mt-4 text-green-400 text-sm font-medium group-hover:gap-2.5 transition-all">
                  <span>Start Quiz</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-16 px-4 border-t border-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Why AIQuiz?</h2>
            <p className="text-gray-500 text-sm">Premium features for serious learners</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className={`${bg} border rounded-xl p-5 hover:scale-105 transition-transform`}
              >
                <Icon className={`w-6 h-6 ${color} mb-3`} />
                <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-8 px-4 text-center">
        <p className="text-gray-600 text-sm">
          <span className="text-green-500">AI</span>Quiz — Powered by live Panaversity docs
        </p>
      </footer>
    </div>
  );
}
