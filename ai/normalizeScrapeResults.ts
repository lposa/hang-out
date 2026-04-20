import OpenAI from 'openai';

type ScrapedData = {
  cinema_name: string;
  title: string;
  date: string | null;
  times: string[];
  source_url: string;
};

type NormalizedRecord = {
  source_title: string;
  movie_title_en: string;
  cinema_name: string;
  show_date: string | null;
  show_times: string[];
  confidence: number;
  notes: string;
};

type NormalizeResult = {
  records: NormalizedRecord[];
};

const normalizeTimes = (times: string[]) =>
  Array.from(new Set(times.filter((value) => /^\d{1,2}:[0-5]\d$/.test(value)))).sort((a, b) =>
    a.localeCompare(b)
  );

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const normalizeChunkWithAI = async (client: OpenAI, items: ScrapedData[]): Promise<NormalizedRecord[]> => {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `
You normalize Serbian cinema scraped data into canonical English movie titles.
Return only valid JSON with:
{
  "records": [
    {
      "source_title": string,
      "movie_title_en": string,
      "cinema_name": string,
      "show_date": string | null,
      "show_times": string[],
      "confidence": number,
      "notes": string
    }
  ]
}
        `.trim(),
      },
      {
        role: 'user',
        content: `
Normalize this array.

Rules:
- Use the official/international English release title for each movie when known.
- Do not do literal translation if the movie has a known official English title.
- If uncertain, keep source_title as movie_title_en and reduce confidence.
- Never invent dates. If no date is present in input, return null.
- Normalize show_times to HH:mm (24h) if provided.

Input:
${JSON.stringify(items, null, 2)}
        `.trim(),
      },
    ],
    max_tokens: 1200,
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? '';
  if (!raw) {
    throw new Error('Empty AI normalization response');
  }

  const parsed = JSON.parse(raw) as NormalizeResult;
  if (!parsed?.records || !Array.isArray(parsed.records)) {
    throw new Error('AI response missing records array');
  }

  return parsed.records;
};

export async function normalizeScrapeResults(scrapedData: ScrapedData[]) {
  try {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing EXPO_PUBLIC_OPENAI_API_KEY');
    }

    const openai = new OpenAI({ apiKey });
    const chunks = chunk(scrapedData, 8);
    const normalizedChunks = await Promise.all(chunks.map((items) => normalizeChunkWithAI(openai, items)));
    const parsedRecords = normalizedChunks.flat();

    const sourceByTitle = scrapedData.reduce<Map<string, ScrapedData[]>>((acc, item) => {
      const existing = acc.get(item.title) ?? [];
      existing.push(item);
      acc.set(item.title, existing);
      return acc;
    }, new Map());
    const sourceIndexByTitle = new Map<string, number>();

    const records = parsedRecords.map((record) => {
      const key = record.source_title;
      const originalCandidates = sourceByTitle.get(key) ?? [];
      const currentIndex = sourceIndexByTitle.get(key) ?? 0;
      const original = originalCandidates[currentIndex] ?? originalCandidates[0];
      sourceIndexByTitle.set(key, currentIndex + 1);

      return {
        cinema_name: record.cinema_name || original?.cinema_name || 'Unknown cinema',
        title: record.movie_title_en || record.source_title || original?.title || '',
        date: original?.date ?? null,
        times: normalizeTimes(original?.times ?? []),
        source_url: original?.source_url ?? '',
        source_title: record.source_title || original?.title || '',
        confidence: record.confidence ?? null,
        notes: record.notes ?? '',
      };
    });

    return { result: { records } };
  } catch (error) {
    console.error('OpenAI Normalize Scrape Results Failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
