---
title: Chat Flow
sidebar_position: 5
---

# Chat Flow

Chat is currently modeled as activity-scoped messaging.

## Tables involved

- `messages`
- `profiles` (for sender display name hydration)

## Message load + realtime

Code references:

- `hooks/useChat.ts`
- `app/(chat)/[id].tsx`

```mermaid
sequenceDiagram
  participant User
  participant ChatHook
  participant MessagesTable
  participant Realtime
  participant ProfilesTable

  User->>ChatHook: Open chat screen for activity_id
  ChatHook->>MessagesTable: select messages by activity_id order created_at desc
  MessagesTable-->>ChatHook: initial messages
  ChatHook->>Realtime: subscribe INSERT on messages filtered by activity_id
  Realtime-->>ChatHook: new message payload
  ChatHook->>ProfilesTable: load sender name (first_name,last_name)
  ChatHook-->>User: append rendered message
```

## Send flow

1. Message is optimistically appended in UI.
2. Insert into `messages` with:
   - `activity_id`
   - `user_id`
   - `text`

## Notes

- `chat_rooms` and `chat_room_participants` are defined in `TABLE_ENUM` but not used in current flow.
- Current chat identity for avatar uses a local static image in code.
