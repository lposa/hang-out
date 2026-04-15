---
title: Activity Lifecycle Flow
sidebar_position: 3
---

# Activity Lifecycle Flow

This flow covers creating an activity, browsing it, joining it, and host-side request management.

## Create activity

Code references:

- `components/AddActivityForm/AddActivityForm.tsx`
- `services/ActivityService.ts`

```mermaid
sequenceDiagram
  participant User
  participant AddActivityForm
  participant SupabaseAuth
  participant ProfilesTable
  participant ActivitiesTable

  User->>AddActivityForm: Submit activity
  AddActivityForm->>SupabaseAuth: getUser()
  AddActivityForm->>ProfilesTable: select first_name,last_name by user.id
  AddActivityForm->>ActivitiesTable: upsert(activity payload)
  ActivitiesTable-->>AddActivityForm: success/error
```

## Home feed loading

Code references:

- `services/ActivityService.ts`
- `app/(tabs)/home.tsx`

- `fetchAllActivities()` loads all and filters out current user's own activities.
- `fetchCurrentUserActivities()` loads activities where `user_id = currentUser`.

## Join request flow

Code references:

- `components/ActivityCard/hooks/useActivity.ts`

```mermaid
flowchart TD
  A[Guest taps Join] --> B[Insert into activity_participants]
  B --> C{Unique conflict?}
  C -- yes --> D[Show already requested toast]
  C -- no --> E[Status = pending]
  E --> F[Host sees pending requests]
  F --> G[Host accepts/declines via update status]
```

## Status model

`ACTIVITY_STATUS_ENUM`:

- `pending`
- `accepted`
- `declined`
- `completed`

## Completion side effects

When host completes activity (`handleCompleteActivity`):

1. Calls RPC `add_review(target_id, new_rating)`
2. Deletes related chat messages by `activity_id`
