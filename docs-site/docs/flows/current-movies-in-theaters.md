---
title: Current Movies In Theaters System
sidebar_position: 6
---

# Current Movies In Theaters System

This document describes the new cinema ingestion and usage system used by the Add Activity flow.

## What this system does

- Fetches local cinema movie listings (currently CineStar data path, with Tavily integration for research-based retrieval).
- Stores normalized movie-level records in `cinema_showtimes`.
- Stores schedule entries per movie in `cinema_showtime_schedule_entries`.
- Renders the data in the **Current Movies In Theaters** tab.
- Allows user to click a time pill and prefill the manual Add Activity form.

## Tavily search

Code reference:

- `services/TavilyService.ts`

Current behavior:

- `TavilyService.getLocalShowtimes()` calls Tavily Research endpoint.
- Prompt asks Tavily to return strict JSON with an `items` array.
- Top-level `times` is intentionally not requested; `schedule` is the source of showtime times.
- If Tavily response is missing/invalid, app falls back to local `latest-showtimes.json`.

### Short description of Tavily

Tavily is a search/research API for LLM workflows. You provide a natural-language query, and Tavily returns web-grounded answer/results. In this project, it is used to gather local theater showtime information and transform it into structured JSON for storage.

## Database schema (current implementation)

### Parent table

- `cinema_showtimes`
  - One row per movie entry per cinema/source identity.
  - Stores metadata and summary fields.

Important columns:

- `cinema_name`
- `title`
- `source_title`
- `source_url`
- `confidence`
- `notes`
- `date`
- `day`
- `premiere`
- `genre`
- `runtime`
- `description`

### Child table

- `cinema_showtime_schedule_entries`
  - Many rows per parent movie row.
  - Linked by FK: `cinema_showtime_id -> cinema_showtimes.id`.

Important columns:

- `cinema_showtime_id`
- `date`
- `day`
- `times` (`text[]`)
- `premiere`

## What gets written to DB

Code references:

- `components/AddActivityForm/components/CurrentMoviesInTheaters/CurrentMoviesInTheaters.tsx`
- `constants/tableEnums.ts`

When user taps **Sync Current Movies To DB**:

1. Fetch showtime items from Tavily (fallback to local JSON).
2. For each movie item:
   - Find existing parent row by `cinema_name + title + source_url`.
   - Update existing row or insert new row in `cinema_showtimes`.
3. Delete existing schedule child rows for that parent id.
4. Insert fresh `schedule[]` into `cinema_showtime_schedule_entries`.

This keeps parent metadata current and avoids stale schedules.

## Retrieval from DB

Code reference:

- `getCinemShowtimesFromDB()` in `CurrentMoviesInTheaters.tsx`

Current read flow:

1. Read all rows from `cinema_showtimes`.
2. Read all rows from `cinema_showtime_schedule_entries`.
3. Build in-memory join:
   - For each movie row, attach all schedule rows where `cinema_showtime_id === movie.id`.
4. Enrich each movie with TMDB poster URL before rendering.

## Types used

### Tavily service type

- `CinemaShowtimeItem` in `services/TavilyService.ts`

Contains:

- movie metadata fields
- `schedule` array with `date`, `day`, `times`, optional `premiere`

### UI/DB type

- `IMovieDataDB` in `CurrentMoviesInTheaters.tsx`

Contains:

- DB movie row fields
- `schedule` child entries
- optional UI enrichment like `moviePoster`

### Showtime click payload

- `ISelectedShowtimePayload` in `CurrentMoviesInTheaters.tsx`

Used for cross-component callback when user taps a time pill:

- `movie`
- `time`
- `date`
- `day`
- `cinemaName`

## User flow: Add Activity

Code references:

- `components/AddActivityForm/AddActivityForm.tsx`
- `components/AddActivityForm/AddActivityManualForm.tsx`
- `components/AddActivityForm/components/CurrentMoviesInTheaters/CurrentMoviesInTheaters.tsx`
- `components/AddActivityForm/components/MovieScheduleList/MovieScheduleList.tsx`

### Manual path

1. User opens **Add Activity** tab.
2. Uses `MovieSearch`, date, time, place, price fields.
3. Submits via Add activity button.

### Now Playing path (prefill)

1. User opens **Current Movies In Theaters** tab.
2. Selects cinema from `FormSelect`.
3. Clicks a time pill on a movie card.
4. App switches to **Add Activity** tab and prefills:
   - movie
   - date
   - time
   - place (cinema)
5. Search bar is hidden when prefilled movie is active.
6. User can tap **Clear selected movie** to reset prefill and return to normal manual behavior.

## Helpful notes and recommendations

- Move Tavily sync to a backend scheduled job (weekly cron) to avoid client-triggered API cost and key exposure.
- Use a DB unique constraint for parent identity (`cinema_name`, `title`, `source_url`) for safer upserts.
- Add an index on `cinema_showtime_schedule_entries.cinema_showtime_id` (already present in schema) for fast joins.
- Consider filtering DB reads by selected cinema in SQL instead of in-memory for scale.
