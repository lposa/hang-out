const { chromium } = require('playwright');
const cheerio = require('cheerio');

const CINESTAR_URL = 'https://cinestarcinemas.rs/zrenjanin-big';
const UI_NOISE_TITLES = new Set(['zanr', 'žanr', 'vise filtera', 'više filtera', 'filter', 'format']);
const DAY_PATTERN =
  '(?:danas|sutra|ponedeljak|utorak|sreda|cetvrtak|četvrtak|petak|subota|nedelja|nedjelja)';

const clean = (value) => value?.replace(/\s+/g, ' ').trim() ?? '';
const normalizeToken = (value) =>
  clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const extractTimes = (text) => {
  const matches = text.match(/\b([01]?\d|2[0-3]):[0-5]\d\b/g) ?? [];
  return Array.from(new Set(matches));
};

const normalizeTimes = (times) => Array.from(new Set(times)).sort((a, b) => a.localeCompare(b));

const parseScheduleByDateTextFallback = (text) => {
  const source = clean(text);
  if (!source) return [];

  const dateSectionRegex = new RegExp(
    `(${DAY_PATTERN}\\s*,?\\s*\\d{1,2}\\.\\d{1,2}\\.[\\s\\S]*?)(?=${DAY_PATTERN}\\s*,?\\s*\\d{1,2}\\.\\d{1,2}\\.|$)`,
    'gi'
  );
  const dayDateRegex = new RegExp(`(${DAY_PATTERN})\\s*,?\\s*(\\d{1,2}\\.\\d{1,2}\\.)`, 'i');

  const schedules = [];
  const matches = source.match(dateSectionRegex) ?? [];

  matches.forEach((part) => {
    const dayDateMatch = part.match(dayDateRegex);
    if (!dayDateMatch) return;
    const day = clean(dayDateMatch[1]);
    const date = clean(dayDateMatch[2]);
    const times = normalizeTimes(extractTimes(part));
    if (times.length === 0) return;
    schedules.push({ date: `${day}, ${date}`, times });
  });

  return schedules;
};

const parseScheduleByDateFromDom = (card, $) => {
  const schedules = [];

  card.find('.day-wrapper').each((_, dayWrapper) => {
    const wrapper = $(dayWrapper);
    const dateText = clean(wrapper.find('.day').first().text());
    const times = normalizeTimes(
      wrapper
        .find('.time')
        .map((__, timeEl) => clean($(timeEl).text()))
        .get()
        .filter(Boolean)
    );

    if (!dateText || times.length === 0) return;
    schedules.push({ date: dateText, times });
  });

  return schedules;
};

const titleFromMoviesImageUrl = (url) => {
  // Example:
  // https://cinestarcinemas.rs/remote/.../movies/The%20Super%20Mario%20Galaxy%20Movie/mario_556x800_rs.jpg?preset=film
  const match = url.match(/\/movies\/([^/]+)\//i);
  if (!match?.[1]) return null;

  const decoded = decodeURIComponent(match[1]);
  const normalized = clean(decoded.replace(/[_-]+/g, ' ').replace(/\s{2,}/g, ' '));

  if (!normalized || normalized.length < 2) return null;
  return normalized;
};

const pickMovieCards = ($) => {
  const selectorCandidates = [
    '[class*="movie"]',
    '[class*="film"]',
    '[class*="program"]',
    '[class*="age]',
    '[class*="duration"]',
    'article',
    'li',
  ];

  for (const selector of selectorCandidates) {
    const nodes = $(selector);
    if (nodes.length >= 3) {
      return nodes;
    }
  }

  return $('article, li, div');
};

async function scrapeCinestarShowtimes({ headless = true, url = CINESTAR_URL } = {}) {
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage({
    userAgent: 'HangOutShowtimeBot/1.0 (+contact: local-dev)',
  });
  const titlesFromNetwork = new Set();

  page.on('response', (response) => {
    const responseUrl = response.url();
    if (!responseUrl.includes('/movies/')) return;
    const parsedTitle = titleFromMoviesImageUrl(responseUrl);
    if (parsedTitle) {
      titlesFromNetwork.add(parsedTitle);
    }
  });

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForTimeout(1500);

    const html = await page.content();
    const $ = cheerio.load(html);
    const cards = pickMovieCards($);

    const collected = [];

    cards.each((_, el) => {
      const card = $(el);
      const cardText = clean(card.text());
      if (!cardText || cardText.length < 20) return;

      const title =
        clean(card.find('h1, h2, h3, h4, [class*="title"], [class*="name"]').first().text()) ||
        clean(cardText.split('\n')[0]);
      const normalizedTitle = normalizeToken(title);

      if (!title || UI_NOISE_TITLES.has(normalizedTitle)) return;
      const schedulesFromDom = parseScheduleByDateFromDom(card, $);
      const schedules = schedulesFromDom.length > 0 ? schedulesFromDom : parseScheduleByDateTextFallback(cardText);
      const times = normalizeTimes(extractTimes(cardText));
      if (times.length === 0) return;

      const dateText =
        clean(card.find('time').first().attr('datetime')) ||
        clean(card.find('[class*="date"], [class*="datum"]').first().text()) ||
        null;

      if (schedules.length > 0) {
        schedules.forEach((schedule) => {
          collected.push({
            cinema_name: 'CineStar',
            title,
            date: schedule.date,
            times: schedule.times,
            source_url: url,
          });
        });
      } else {
        collected.push({
          cinema_name: 'CineStar',
          title,
          date: dateText,
          times,
          source_url: url,
        });
      }
    });

    // Fallback: this website's program page often renders posters via JS/image URLs
    // without exposing showtimes in static text content.
    if (collected.length === 0 && titlesFromNetwork.size > 0) {
      titlesFromNetwork.forEach((title) => {
        collected.push({
          cinema_name: 'CineStar',
          title,
          date: null,
          times: [],
          source_url: url,
        });
      });
    }

    const dedupedMap = new Map();
    for (const item of collected) {
      const key = `${item.title.toLowerCase()}|${item.date ?? 'unknown'}|${item.times.join(',')}`;
      if (!dedupedMap.has(key)) {
        dedupedMap.set(key, item);
      }
    }

    return Array.from(dedupedMap.values());
  } finally {
    await browser.close();
  }
}

module.exports = {
  scrapeCinestarShowtimes,
};
