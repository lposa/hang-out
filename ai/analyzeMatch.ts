import OpenAI from 'openai';
import { ProfileTopTenMoviesRow } from '@/hooks/useProfile';

const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

type MatchResult = {
  compatibility_score: number;
  shared_movies: string[];
  shared_genres: string[];
  notes: string;
};

export async function analyzeMatch(
  userAMovies: ProfileTopTenMoviesRow,
  userBMovies: ProfileTopTenMoviesRow
) {
  console.log(
    'Analyzing match between users:',
    userAMovies.top_ten_movies,
    userBMovies.top_ten_movies
  );

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
You are an assistant that compares two users' top-10 movie lists and estimates how compatible their movie tastes are.
You MUST answer with a single JSON object matching this TypeScript type:

{
  "compatibility_score": number,      // 0–100, higher means more similar taste
  "shared_movies": string[],          // list of movie titles present in both lists
  "shared_genres": string[],          // genres that are strongly shared across lists
  "notes": string                     // short, friendly explanation of why you chose this score
}
        `.trim(),
        },
        {
          role: 'user',
          content: `
Here are two users' top movies.

User A movies (JSON):
${JSON.stringify(userAMovies, null, 2)}

User B movies (JSON):
${JSON.stringify(userBMovies, null, 2)}

Please:
- Look at overlapping titles (same or very similar titles).
- Consider genres, tone, release years, and general vibe.
- Give a compatibility_score from 0 to 100.
- Fill in shared_movies and shared_genres based on the data.
- Return ONLY the JSON object, no additional text.
          `.trim(),
        },
      ],
      max_tokens: 400,
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? '';
    const result: MatchResult = JSON.parse(raw);
    return { result };
  } catch (error) {
    console.error('OpenAI Movie Match Failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
