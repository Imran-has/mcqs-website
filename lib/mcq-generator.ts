import { MCQ, MCQOption } from './types';
import { ScrapedContent } from './scraper';

let idCounter = 0;
function generateId(): string {
  return `mcq_${++idCounter}_${Math.random().toString(36).substr(2, 6)}`;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createOptions(correct: string, distractors: string[]): MCQOption[] {
  const options: MCQOption[] = [
    { id: 'a', text: correct },
    ...distractors.slice(0, 3).map((text, i) => ({ id: String.fromCharCode(98 + i), text })),
  ];
  return shuffle(options);
}

function extractKeyTerms(text: string): string[] {
  const words = text.split(/\s+/);
  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'about',
    'against', 'between', 'into', 'through', 'during', 'before', 'after',
    'above', 'below', 'from', 'up', 'down', 'out', 'off', 'over', 'under',
    'again', 'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'so',
    'yet', 'both', 'either', 'neither', 'not', 'only', 'own', 'same',
    'than', 'too', 'very', 'just', 'because', 'as', 'until', 'while',
    'that', 'this', 'these', 'those', 'which', 'who', 'whom', 'what',
    'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both',
    'few', 'more', 'most', 'other', 'some', 'such', 'no', 'it', 'its',
    'we', 'our', 'you', 'your', 'they', 'their', 'he', 'she', 'him',
    'her', 'his', 'my', 'me', 'i', 'also', 'any', 'if', 'else'
  ]);

  const terms = new Set<string>();
  for (const word of words) {
    const clean = word.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    if (clean.length > 4 && !stopWords.has(clean)) {
      terms.add(clean);
    }
  }
  return Array.from(terms);
}

function buildFillBlankQuestion(
  sentence: string,
  chapterId: string,
  allTerms: string[]
): MCQ | null {
  const words = sentence.split(/\s+/);
  if (words.length < 8) return null;

  const stopWords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'it', 'its',
    'this', 'that', 'these', 'those', 'and', 'or', 'but', 'in', 'on',
    'at', 'to', 'of', 'for', 'with', 'by', 'from', 'as', 'not', 'can',
    'will', 'may', 'have', 'has', 'had', 'do', 'does', 'did', 'also',
    'we', 'our', 'you', 'they', 'he', 'she', 'their', 'which', 'when',
    'where', 'how', 'what', 'if', 'so', 'than', 'then', 'such', 'each'
  ]);

  // Find a meaningful word to blank out (prefer longer important words)
  let targetIndex = -1;
  let targetWord = '';

  for (let i = Math.floor(words.length * 0.3); i < Math.floor(words.length * 0.8); i++) {
    const clean = words[i].replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
    if (clean.length > 4 && !stopWords.has(clean)) {
      targetIndex = i;
      targetWord = words[i].replace(/[^a-zA-Z0-9-]/g, '');
      break;
    }
  }

  if (targetIndex === -1 || !targetWord) return null;

  const blanked = [...words];
  blanked[targetIndex] = '___________';
  const question = `Complete the statement: "${blanked.join(' ')}"`;

  // Find distractors from all terms (different from correct answer)
  const distractors = allTerms
    .filter(t => t.toLowerCase() !== targetWord.toLowerCase() && t.length > 3)
    .slice(0, 3);

  if (distractors.length < 3) {
    // Pad with generic distractors
    const generic = ['framework', 'module', 'component', 'interface', 'protocol', 'schema', 'agent', 'pipeline'];
    while (distractors.length < 3) {
      const g = generic[distractors.length % generic.length];
      if (!distractors.includes(g) && g !== targetWord.toLowerCase()) {
        distractors.push(g);
      } else {
        distractors.push(`option_${distractors.length}`);
      }
    }
  }

  return {
    id: generateId(),
    question,
    options: createOptions(targetWord, distractors),
    correctAnswer: targetWord,
    explanation: `The correct word is "${targetWord}". Original: "${sentence}"`,
    difficulty: 'medium',
    chapterId,
  };
}

function buildConceptQuestion(
  heading: string,
  relatedText: string,
  chapterId: string,
  otherHeadings: string[]
): MCQ {
  const question = `Which of the following best describes "${heading}"?`;

  // Summarize related text to ~80 chars
  const correct = relatedText.substring(0, 120).trim() + (relatedText.length > 120 ? '...' : '');

  const distractors = otherHeadings
    .filter(h => h !== heading)
    .slice(0, 3)
    .map(h => `A concept related to ${h}`);

  while (distractors.length < 3) {
    distractors.push(`An unrelated architectural pattern not covered in this topic`);
  }

  return {
    id: generateId(),
    question,
    options: createOptions(correct, distractors),
    correctAnswer: correct,
    explanation: `"${heading}" refers to: ${correct}`,
    difficulty: 'easy',
    chapterId,
  };
}

function buildTrueFalseStyleQuestion(
  fact: string,
  chapterId: string
): MCQ | null {
  if (fact.length < 40) return null;

  const question = `Which statement is TRUE about this topic?`;
  const distractors = [
    `The opposite: ${fact.split(' ').slice(0, 8).join(' ')} is NOT part of this concept.`,
    `This concept only applies in a single-agent scenario.`,
    `This feature is deprecated and no longer recommended.`,
  ];

  return {
    id: generateId(),
    question: `Based on the content: "${fact.substring(0, 100)}..." — which of the following is correct?`,
    options: createOptions(
      fact.substring(0, 120) + (fact.length > 120 ? '...' : ''),
      distractors
    ),
    correctAnswer: fact.substring(0, 120) + (fact.length > 120 ? '...' : ''),
    explanation: `The correct answer is directly stated in the source material.`,
    difficulty: 'hard',
    chapterId,
  };
}

function buildDefinitionQuestion(
  term: string,
  definition: string,
  chapterId: string,
  otherDefinitions: string[]
): MCQ {
  const question = `What is "${term}"?`;

  const distractors = otherDefinitions
    .filter(d => d !== definition)
    .slice(0, 3);

  while (distractors.length < 3) {
    distractors.push(`A deprecated legacy pattern not used in modern AI systems`);
  }

  return {
    id: generateId(),
    question,
    options: createOptions(definition, distractors),
    correctAnswer: definition,
    explanation: `"${term}" is defined as: ${definition}`,
    difficulty: 'medium',
    chapterId,
  };
}

function extractDefinitions(paragraphs: string[]): Array<{ term: string; definition: string }> {
  const definitions: Array<{ term: string; definition: string }> = [];
  const patterns = [
    /^([A-Z][a-zA-Z\s]{2,30})\s+(?:is|are|refers to|means|represents)\s+(.{20,150})/,
    /^([A-Z][a-zA-Z\s]{2,30}):\s+(.{20,150})/,
    /The\s+([a-zA-Z\s]{3,30})\s+(?:is|are|refers to)\s+(.{20,150})/i,
  ];

  for (const para of paragraphs) {
    for (const pattern of patterns) {
      const match = para.match(pattern);
      if (match) {
        const term = match[1].trim();
        const definition = match[2].trim();
        if (term.split(' ').length <= 5 && definition.length > 20) {
          definitions.push({ term, definition });
          break;
        }
      }
    }
  }
  return definitions.slice(0, 10);
}

export function generateMCQs(content: ScrapedContent, chapterId: string, count: number = 15): MCQ[] {
  const questions: MCQ[] = [];
  const allTerms = extractKeyTerms(content.fullText);
  const definitions = extractDefinitions(content.paragraphs);

  // 1. Definition-based questions
  if (definitions.length > 0) {
    const allDefs = definitions.map(d => d.definition);
    for (const def of definitions.slice(0, 5)) {
      const otherDefs = allDefs.filter(d => d !== def.definition);
      questions.push(buildDefinitionQuestion(def.term, def.definition, chapterId, otherDefs));
    }
  }

  // 2. Fill-in-the-blank from paragraphs
  const meaningfulParagraphs = content.paragraphs.filter(p => p.length > 60 && p.length < 400);
  const step = Math.max(1, Math.floor(meaningfulParagraphs.length / 8));
  for (let i = 0; i < meaningfulParagraphs.length && questions.length < count; i += step) {
    const q = buildFillBlankQuestion(meaningfulParagraphs[i], chapterId, allTerms);
    if (q) questions.push(q);
  }

  // 3. Concept questions from headings
  if (content.headings.length > 1) {
    for (let i = 0; i < content.headings.length && questions.length < count; i++) {
      const heading = content.headings[i];
      const related = content.paragraphs[i] || content.paragraphs[0] || '';
      if (related.length > 30) {
        const otherHeadings = content.headings.filter(h => h !== heading);
        questions.push(buildConceptQuestion(heading, related, chapterId, otherHeadings));
      }
    }
  }

  // 4. True/false style from list items
  const meaningfulItems = content.listItems.filter(item => item.length > 50);
  for (let i = 0; i < meaningfulItems.length && questions.length < count; i += 2) {
    const q = buildTrueFalseStyleQuestion(meaningfulItems[i], chapterId);
    if (q) questions.push(q);
  }

  // 5. Ensure minimum question count with paragraph-based questions
  if (questions.length < 10 && content.paragraphs.length > 0) {
    for (const para of content.paragraphs) {
      if (questions.length >= count) break;
      if (para.length > 80) {
        const q = buildTrueFalseStyleQuestion(para, chapterId);
        if (q) questions.push(q);
      }
    }
  }

  // Shuffle and limit
  return shuffle(questions).slice(0, count);
}
