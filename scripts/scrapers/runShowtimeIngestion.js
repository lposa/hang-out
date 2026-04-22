#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { scrapeCinestarShowtimes } = require('./providers/cinestar.rs');

const OUTPUT_DIR = path.resolve(process.cwd(), 'scripts/scrapers/output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'latest-showtimes.json');

const args = process.argv.slice(2);
const shouldWriteSupabase = args.includes('--write');
const showBrowser = args.includes('--headed');
const shouldNormalizeWithAI = args.includes('--normalize-ai');
const UI_NOISE_TOKENS = new Set([
  'zanr',
  'žanr',
  'vise filtera',
  'više filtera',
  'filter',
  'filters',
  'format',
  'zanrovi',
]);
const PREMIERE_TOKEN_PATTERN = /\b(pretpremijera|premijera|pretprodaja)\b/i;

const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, 'utf8');
  return raw.split('\n').reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return acc;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return acc;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    acc[key] = value;
    return acc;
  }, {});
};

const loadEnv = () => {
  const envFromFile = parseEnvFile(path.resolve(process.cwd(), '.env'));
  for (const [key, value] of Object.entries(envFromFile)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
};

const writeOutputFile = (items) => {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        count: items.length,
        items,
      },
      null,
      2
    )
  );
};

const toComparableToken = (value) =>
  (value ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const isUiNoiseRecord = (item) => {
  const title = toComparableToken(item?.title || item?.source_title);
  const date = toComparableToken(item?.date);
  return UI_NOISE_TOKENS.has(title) || UI_NOISE_TOKENS.has(date);
};

const normalizeTimes = (times) =>
  Array.from(
    new Set((Array.isArray(times) ? times : []).filter((value) => /^\d{1,2}:[0-5]\d$/.test(value)))
  ).sort((a, b) => a.localeCompare(b));

const DAY_EN_MAP = {
  danas: 'today',
  sutra: 'tomorrow',
  ponedeljak: 'monday',
  utorak: 'tuesday',
  sreda: 'wednesday',
  cetvrtak: 'thursday',
  četvrtak: 'thursday',
  petak: 'friday',
  subota: 'saturday',
  nedelja: 'sunday',
  nedjelja: 'sunday',
};

const splitDateAndDay = (rawDate) => {
  if (!rawDate) {
    return { date: null, day: null };
  }

  const text = rawDate.toString().trim();
  const dateMatch = text.match(/(\d{1,2}\.\d{1,2}(?:\.\d{2,4})?\.?)/);
  const date = dateMatch?.[1]?.replace(/\.$/, '') ?? text;

  const dayTokenRaw = text.split(',')[0]?.trim() ?? '';
  const dayToken = toComparableToken(dayTokenRaw);
  const day = DAY_EN_MAP[dayToken] ?? null;

  return { date, day };
};

const canonicalTitleToken = (value) =>
  toComparableToken((value ?? '').toString().replace(PREMIERE_TOKEN_PATTERN, '').trim());

const groupByDateSchedule = (items) => {
  const grouped = new Map();

  items.forEach((item) => {
    const titleKey = canonicalTitleToken(item.title || item.source_title);
    const groupKey = `${item.cinema_name}|${item.source_url}|${titleKey}`;
    const existing = grouped.get(groupKey);

    if (!existing) {
      grouped.set(groupKey, {
        cinema_name: item.cinema_name,
        title: item.title,
        source_title: item.source_title ?? item.title,
        source_url: item.source_url,
        confidence: item.confidence ?? null,
        notes: item.notes ?? '',
        genre: item.genre ?? null,
        runtime: item.runtime ?? null,
        description: item.description ?? null,
        scheduleMap: new Map(),
      });
    }

    const target = grouped.get(groupKey);
    const normalizedDateInfo = splitDateAndDay(item.date);
    const dateKey = normalizedDateInfo.date;
    const existingEntry = target.scheduleMap.get(dateKey) ?? { times: [], premiere: false };
    target.scheduleMap.set(dateKey, {
      times: normalizeTimes([...existingEntry.times, ...(item.times ?? [])]),
      premiere: Boolean(existingEntry.premiere || item.premiere),
    });
  });

  return Array.from(grouped.values()).map((item) => {
    const schedule = Array.from(item.scheduleMap.entries()).map(([date, scheduleData]) => {
      const dayInfo = splitDateAndDay(date);
      return {
        date: dayInfo.date,
        day: dayInfo.day,
        premiere: scheduleData.premiere,
        times: scheduleData.times,
      };
    });
    const firstSchedule = schedule[0] ?? { date: null, day: null, times: [] };
    return {
      cinema_name: item.cinema_name,
      title: item.title,
      source_title: item.source_title,
      source_url: item.source_url,
      confidence: item.confidence,
      notes: item.notes,
      genre: item.genre,
      runtime: item.runtime,
      description: item.description,
      date: firstSchedule.date,
      day: firstSchedule.day,
      premiere: Boolean(firstSchedule.premiere),
      times: firstSchedule.times,
      schedule,
    };
  });
};

const sanitizeOutput = (items) => groupByDateSchedule(items.filter((item) => !isUiNoiseRecord(item)));

const writeToSupabase = async (items) => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY or EXPO_PUBLIC_SUPABASE_URL for --write mode.'
    );
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // NOTE: Adjust table/columns to your final schema.
  const rows = items.flatMap((item) => {
    if (Array.isArray(item.schedule) && item.schedule.length > 0) {
      return item.schedule.flatMap((scheduleEntry) =>
        (scheduleEntry.times.length > 0 ? scheduleEntry.times : [null]).map((time) => ({
          cinema_name: item.cinema_name,
          movie_title_raw: item.title,
          show_date_raw: scheduleEntry.date,
          show_time: time,
          source_url: item.source_url,
          scraped_at: new Date().toISOString(),
        }))
      );
    }

    return (item.times.length > 0 ? item.times : [null]).map((time) => ({
      cinema_name: item.cinema_name,
      movie_title_raw: item.title,
      show_date_raw: item.date,
      show_time: time,
      source_url: item.source_url,
      scraped_at: new Date().toISOString(),
    }));
  });

  const { error } = await supabase.from('cinema_showtimes').upsert(rows);
  if (error) {
    throw error;
  }
};

async function main() {
  loadEnv();

  console.log('Starting showtime ingestion...');
  const scrapedShowtimes = await scrapeCinestarShowtimes({ headless: !showBrowser });
  let showtimes = scrapedShowtimes;

  if (shouldNormalizeWithAI && scrapedShowtimes.length > 0) {
    console.log('Normalizing scraped data with AI...');
    try {
      const normalizerModule = await import('../../ai/normalizeScrapeResults.ts');
      const normalizeScrapeResults =
        normalizerModule.normalizeScrapeResults ||
        normalizerModule.default?.normalizeScrapeResults ||
        normalizerModule['module.exports']?.normalizeScrapeResults;

      if (typeof normalizeScrapeResults !== 'function') {
        throw new Error('normalizeScrapeResults export was not found');
      }

      const { result, error } = await normalizeScrapeResults(scrapedShowtimes);

      if (error) {
        throw new Error(error);
      }

      showtimes = result.records;
      console.log(`AI-normalized ${showtimes.length} records`);
    } catch (error) {
      console.error('AI normalization failed, falling back to raw scraped data:', error);
      showtimes = scrapedShowtimes;
    }
  }

  showtimes = sanitizeOutput(showtimes);

  writeOutputFile(showtimes);
  console.log(`Prepared ${showtimes.length} records`);
  console.log(`Saved output to ${OUTPUT_FILE}`);

  if (shouldWriteSupabase) {
    await writeToSupabase(showtimes);
    console.log('Wrote records to Supabase table: cinema_showtimes');
  } else {
    console.log('Dry-run mode: skipped Supabase write. Use --write to enable.');
  }
}

main().catch((error) => {
  console.error('Showtime ingestion failed:', error);
  process.exit(1);
});

