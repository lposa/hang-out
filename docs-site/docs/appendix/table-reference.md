---
title: Supabase Table Reference
sidebar_position: 1
---

# Supabase Table Reference

This is a practical, code-driven reference.

## `profiles`

Used by:

- `hooks/useProfile.ts`
- `components/ProfileForm/ProfileForm.tsx`
- `components/EditCardsForm/EditsCardsForm.tsx`
- `components/AddActivityForm/AddActivityForm.tsx`
- `hooks/useChat.ts` (sender names)

Key fields read/written in code:

- `id`
- `first_name`, `last_name`
- `birthday`
- `top_ten_movies`
- `image`
- `updated_at`

## `activities`

Used by:

- `components/AddActivityForm/AddActivityForm.tsx`
- `services/ActivityService.ts`

Key fields:

- `id`
- `user_id`
- `first_name`, `last_name`, `email`
- `activity_type`
- `activity_data`
- `date`, `time`, `place`, `price`
- `created_at`

## `activity_participants`

Used by:

- `components/ActivityCard/hooks/useActivity.ts`

Key fields:

- `id`
- `activity_id`
- `guest_user_id`
- `status` (`pending`, `accepted`, `declined`, `completed`)

## `compatibility_matches`

Used by:

- `components/ActivityPosterDetails/ActivityPosterDetails.tsx`
- `app/(profile)/profile-screen/[id].tsx`

Key fields:

- `user_id`
- `target_user_id`
- `category`
- `score`
- `shared_items`
- `shared_tags`
- `notes`
- `updated_at`

Expected unique key:

- (`user_id`, `target_user_id`, `category`)

## `messages`

Used by:

- `hooks/useChat.ts`
- `components/ActivityCard/hooks/useActivity.ts` (delete on completion)

Key fields:

- `id`
- `activity_id`
- `user_id`
- `text`
- `created_at`

## `chat_rooms` and `chat_room_participants`

Currently declared in `constants/tableEnums.ts` but not referenced by active feature code.
