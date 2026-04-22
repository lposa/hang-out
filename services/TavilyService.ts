type MovieScheduleEntry = {
  date: string | null;
  day: string | null;
  times: string[];
  premiere?: boolean;
};

export type CinemaShowtimeItem = {
  cinema_name: string;
  title: string;
  source_title: string;
  source_url: string;
  confidence: number;
  notes: string;
  date: string | null;
  day: string | null;
  schedule: MovieScheduleEntry[];
  premiere?: boolean;
  genre?: string | null;
  runtime?: string | null;
  description?: string | null;
};

const TAVILY_RESEARCH_ENDPOINT = 'https://api.tavily.com/research';

const extractJsonCandidate = (input: string): string | null => {
  const fenced = input.match(/```json\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const objectMatch = input.match(/\{[\s\S]*\}/);
  if (objectMatch?.[0]) {
    return objectMatch[0].trim();
  }

  const arrayMatch = input.match(/\[[\s\S]*\]/);
  if (arrayMatch?.[0]) {
    return arrayMatch[0].trim();
  }

  return null;
};

const toItems = (parsed: unknown): CinemaShowtimeItem[] | null => {
  if (Array.isArray(parsed)) {
    return parsed as CinemaShowtimeItem[];
  }

  if (
    parsed &&
    typeof parsed === 'object' &&
    Array.isArray((parsed as { items?: unknown[] }).items)
  ) {
    return (parsed as { items: CinemaShowtimeItem[] }).items;
  }

  return null;
};

export class TavilyService {
  async getLocalShowtimes(): Promise<CinemaShowtimeItem[] | null> {
    const apiKey = process.env.EXPO_PUBLIC_TAVILY_API_KEY;
    if (!apiKey) {
      console.error('Missing EXPO_PUBLIC_TAVILY_API_KEY');
      return null;
    }

    try {
      const response = await fetch(TAVILY_RESEARCH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          topic: 'general',
          search_depth: 'advanced',
          max_results: 8,
          include_answer: true,
          include_raw_content: true,
          query:
            'Search my local movie theater (Cinestar Zrenjanin, Serbia) for current movies showing and next 7 days. Return ONLY valid JSON with {"items":[{cinema_name:string,title:string,source_title:string,source_url:string,confidence:number,notes:string,date:string|null,day:string|null,schedule:{date:string|null,day:string|null,times:string[],premiere?:boolean}[],premiere?:boolean,genre?:string|null,runtime?:string|null,description?:string|null}]}. Do not include top-level times field; keep times only inside schedule entries.',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tavily API Error (getLocalShowtimes):', response.status, errorText);
        return null;
      }

      const payload = (await response.json()) as {
        answer?: string;
        results?: { content?: string }[];
      };

      const rawText =
        payload.answer || payload.results?.map((result) => result.content || '').join('\n') || '';
      const jsonCandidate = extractJsonCandidate(rawText);

      if (!jsonCandidate) {
        console.error('Tavily did not return parseable JSON payload');
        return null;
      }

      const parsed = JSON.parse(jsonCandidate) as unknown;
      const items = toItems(parsed);
      if (!items) {
        console.error('Tavily JSON payload does not match expected items shape');
        return null;
      }

      return items;
    } catch (error) {
      console.error('Tavily getLocalShowtimes failed:', error);
      return null;
    }
  }
}
