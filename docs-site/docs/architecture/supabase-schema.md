---
title: Supabase Schema and Relationships
sidebar_position: 2
---

# Supabase Schema and Relationships

This is the data model currently implied by application code.

## Tables referenced in code

- `profiles`
- `activities`
- `activity_participants`
- `compatibility_matches`
- `messages`
- `cinema_showtimes`
- `cinema_showtime_schedule_entries`
- `chat_rooms` *(declared in enum, not actively used in current flows)*
- `chat_room_participants` *(declared in enum, not actively used in current flows)*

## Relationship graph

```mermaid
erDiagram
  PROFILES {
    uuid id PK
    text first_name
    text last_name
    text birthday
    jsonb top_ten_movies
    text image
    timestamptz updated_at
  }

  ACTIVITIES {
    uuid id PK
    uuid user_id FK
    text first_name
    text last_name
    text email
    text activity_type
    jsonb activity_data
    date date
    text time
    text place
    numeric price
    timestamptz created_at
  }

  ACTIVITY_PARTICIPANTS {
    uuid id PK
    uuid activity_id FK
    uuid guest_user_id FK
    text status
  }

  COMPATIBILITY_MATCHES {
    uuid id PK
    uuid user_id FK
    uuid target_user_id FK
    text category
    numeric score
    text[] shared_items
    text[] shared_tags
    text notes
    timestamptz updated_at
  }

  MESSAGES {
    uuid id PK
    uuid activity_id FK
    uuid user_id FK
    text text
    timestamptz created_at
  }

  CINEMA_SHOWTIMES {
    uuid id PK
    text cinema_name
    text title
    text source_title
    text source_url
    numeric confidence
    text notes
    text date
    text day
    boolean premiere
    text genre
    text runtime
    text description
    timestamptz created_at
    timestamptz updated_at
  }

  CINEMA_SHOWTIME_SCHEDULE_ENTRIES {
    uuid id PK
    uuid cinema_showtime_id FK
    text date
    text day
    text[] times
    boolean premiere
    timestamptz created_at
  }

  PROFILES ||--o{ ACTIVITIES : "hosts (activities.user_id)"
  PROFILES ||--o{ ACTIVITY_PARTICIPANTS : "joins (guest_user_id)"
  ACTIVITIES ||--o{ ACTIVITY_PARTICIPANTS : "has participants"
  PROFILES ||--o{ COMPATIBILITY_MATCHES : "initiator (user_id)"
  PROFILES ||--o{ COMPATIBILITY_MATCHES : "target (target_user_id)"
  PROFILES ||--o{ MESSAGES : "sends"
  ACTIVITIES ||--o{ MESSAGES : "contains chat"
  CINEMA_SHOWTIMES ||--o{ CINEMA_SHOWTIME_SCHEDULE_ENTRIES : "has schedule entries"
```

## Important constraints implied by code

- `compatibility_matches` uses upsert conflict target:
  - `user_id, target_user_id, category`
  - This implies a unique constraint should exist on that tuple.
- `activity_participants` insert handles duplicate join request with Postgres code `23505`
  - This implies a unique constraint likely exists for one participant per activity, typically:
    - `(activity_id, guest_user_id)`
- Missing-row checks in some queries rely on `.single()` behavior and Supabase error codes.

## RPC usage

- `add_review(target_id, new_rating)` is called from `useActivity`.
  - This function is expected to live in Supabase Postgres as a custom RPC function.

## Notes on declared-but-unused tables

`TABLE_ENUM` includes `chat_rooms` and `chat_room_participants`, but current chat flow is activity-scoped via `messages.activity_id`.
