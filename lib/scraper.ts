import * as cheerio from 'cheerio';

export interface ScrapedContent {
  title: string;
  headings: string[];
  paragraphs: string[];
  listItems: string[];
  codeBlocks: string[];
  fullText: string;
}

export async function fetchAndParseContent(url: string): Promise<ScrapedContent> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; MCQBot/1.0)',
      'Accept': 'text/html,application/xhtml+xml',
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove unwanted elements
  $('script, style, nav, footer, header, .sidebar, .navigation, .menu, .ads, iframe').remove();
  $('div[class*="nav"], div[class*="footer"], div[class*="header"], div[class*="sidebar"]').remove();
  $('div[id*="nav"], div[id*="footer"], div[id*="header"], div[id*="sidebar"]').remove();

  // Get page title
  const title = $('h1').first().text().trim() || $('title').text().trim();

  // Extract headings
  const headings: string[] = [];
  $('h1, h2, h3, h4').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 3 && text.length < 200) {
      headings.push(text);
    }
  });

  // Extract paragraphs
  const paragraphs: string[] = [];
  $('p, article p, main p, .content p, [class*="content"] p').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 30) {
      paragraphs.push(text);
    }
  });

  // Extract list items
  const listItems: string[] = [];
  $('li').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 10 && text.length < 500) {
      listItems.push(text);
    }
  });

  // Extract code blocks (for technical content)
  const codeBlocks: string[] = [];
  $('code, pre').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 10) {
      codeBlocks.push(text.substring(0, 200));
    }
  });

  // If standard selectors got nothing, try the full body
  if (paragraphs.length === 0) {
    $('body *').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 50 && text.length < 1000) {
        const tagName = (el as cheerio.Element & { tagName?: string }).tagName?.toLowerCase();
        if (tagName === 'p' || tagName === 'div' || tagName === 'section') {
          paragraphs.push(text);
        }
      }
    });
  }

  const fullText = [
    ...headings,
    ...paragraphs,
    ...listItems,
  ].join(' ').replace(/\s+/g, ' ').trim();

  return {
    title,
    headings,
    paragraphs,
    listItems,
    codeBlocks,
    fullText,
  };
}
