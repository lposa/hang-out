# Showtime Scrapers (Minimal Run Model)

This is a minimal scraper pipeline for local cinema showtimes.

## Included

- Provider: `providers/cinestar.rs.js`
- Runner: `runShowtimeIngestion.js`
- Output JSON: `scripts/scrapers/output/latest-showtimes.json`

## Commands

From project root:

- Dry run (recommended first):
  - `npm run scrape:cinestar`
- Visual browser mode (debug selectors):
  - `npm run scrape:cinestar:headed`
- Dry run + AI normalization (EN titles/date/time normalization):
  - `npm run scrape:cinestar:normalize`
- Write to Supabase table (`cinema_showtimes`):
  - `npm run scrape:cinestar:write`
- AI normalize + write:
  - `npm run scrape:cinestar:normalize:write`

## Write mode requirements

`--write` expects:

- `EXPO_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

If missing, script will fail intentionally.

AI normalization requires:

- `EXPO_PUBLIC_OPENAI_API_KEY`

## Notes

- Current selector strategy is intentionally generic to get you running quickly.
- You should tighten selectors per-site for better title/time extraction.
- Respect robots.txt and ToS; keep request rate low.
