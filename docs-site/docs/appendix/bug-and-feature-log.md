---
title: Bug and Feature Log
sidebar_position: 2
---

# Bug and Feature Log

This page tracks current MVP issues and planned features with practical implementation notes.

Last updated: 2026-02-06

## Fixed Bugs

### BUG-001 - Chat not updating in realtime (fixed)

- **Original behavior:** User B only saw new messages after leaving and re-entering chat.
- **Status:** Fixed.
- **Code area:** `hooks/useChat.ts`
- **Notes:** Kept here for historical context and regression tracking.

---

### BUG-002 - New activities do not appear immediately (fixed)

- **Original behavior:** New activity appeared only after full app reload.
- **Status:** Fixed.
- **Code area:** `app/(tabs)/home.tsx`, `components/AddActivityForm/AddActivityForm.tsx`
- **Fix applied:** Refresh both activity lists after add (`fetchActivities()` + `fetchUserActivities()`) and await `onSubmitCallback` in add activity form.

---

## Confirmed Bugs (MVP)

### BUG-003 - Keyboard covers Add Activity form fields

- **Reported behavior:** Keyboard overlaps form inputs.
- **Impact:** Medium-High (form completion friction).
- **Code area:** `components/AddActivityForm/AddActivityForm.tsx` inside modal.
- **Likely cause:** No `KeyboardAvoidingView` / keyboard-aware scroll behavior around modal form.
- **Suggested fix plan:**
  1. Wrap modal content in `KeyboardAvoidingView` (`behavior="padding"` iOS).
  2. Use `ScrollView` with `keyboardShouldPersistTaps="handled"`.
  3. Add bottom padding with safe area insets while keyboard is open.

---

### BUG-004 - Movie search too restrictive (title variants)

- **Reported behavior:** Queries like "Odyssey by Christopher Nolan" fail while "The Odyssey" works.
- **Impact:** Medium.
- **Code area:** `hooks/useSearch.ts`, `services/MovieDBService.ts`, `components/Search/MovieSearch.tsx`
- **Likely cause:** Single direct title query to external API with little normalization/ranking.
- **Suggested fix plan:**
  1. Preprocess query (remove filler words like "by", extract director/year hints).
  2. Add fuzzy ranking by title similarity + release year proximity.
  3. Add secondary fallback search against cleaned query tokens.
  4. Consider local index/cache of popular movies for typo tolerance.

---

### BUG-005 - Completing activity does not remove activity

- **Reported behavior:** Completing activity has no visible effect on activity list (MVP expects removal).
- **Impact:** High.
- **Code area:** `components/ActivityCard/hooks/useActivity.ts`
- **Current behavior in code:**
  - `handleCompleteActivity()` calls:
    - `rateUser(reviewScore)` via RPC `add_review`
    - `deleteChat()` (deletes messages for activity)
  - **No delete/update on `activities` table**, so activity remains visible.
- **Suggested MVP fix:**
  1. In completion flow, add:
     - hard delete: `from(TABLE_ENUM.ACTIVITIES).delete().eq('id', activityId)`  
       **or**
     - soft delete/status column (`status = completed`) and filter in feed.
  2. Refresh activity lists after completion.

#### Review check result (requested)

- **Is reviewing wired?** Partially yes.
- In `rateUser()`, review is sent via `supabase.rpc('add_review', { target_id, new_rating })`.
- **Caveat:** It fetches participant via `.single()` on `activity_participants` by `activity_id`.  
  If there are multiple participant rows, `.single()` can fail or pick the wrong target for review.
- **Recommendation:** Determine explicit target participant (e.g., accepted participant ID) and pass that directly.

---

## Desired Features

### FEAT-001 - AI match before accepting participant (pending stage)

- **Goal:** Activity host can evaluate compatibility before accepting pending users.
- **Suggested UX:**
  - In pending request item card, add `View Profile` and `Run AI Match` actions.
  - Show match score inline on pending row.
- **Suggested implementation:**
  1. Reuse existing match logic from `ActivityPosterDetails`.
  2. Expose a reusable `calculateCompatibility(currentUserId, targetUserId, category)` utility/service.
  3. Cache/store result in `compatibility_matches` and display in pending list.

---

### FEAT-002 - Profile image upload + Supabase URL storage

- **Goal:** Upload profile pictures to cloud storage and store URL in `profiles.image`.
- **Suggested implementation (Supabase-native):**
  1. Create Supabase Storage bucket (e.g., `profile-images`).
  2. Upload selected image from app (Expo image picker + Supabase storage upload).
  3. Save public/signed URL to `profiles.image`.
  4. Add update + delete/replace flow.
- **Notes:** Define image size/compression policy and content-type validation.

---

### FEAT-003 - AI agent for local cinema showtimes/prices

- **Goal:** Auto-ingest local cinema listings, times, and prices.
- **Suggested rollout:**
  1. **Phase 1:** scheduled ingestion job (not full agent yet), store in Supabase tables.
  2. **Phase 2:** show “Now Showing” in Add Activity flow.
  3. **Phase 3:** agent intelligence (source fallback, quality checks, summarization).
- **Key risks:** source ToS/licensing, data freshness, locale/timezone normalization.

---

## Priority Snapshot

- **P0:** BUG-005
- **P1:** BUG-003, FEAT-001
- **P2:** BUG-004, FEAT-002
- **P3:** FEAT-003
