---
title: Account Onboarding Flow
sidebar_position: 1
---

# Account Onboarding Flow

This flow covers sign-up, email verification branch, login, and app routing.

## Signup flow

Code references:

- `app/(auth)/register.tsx`
- `app/_layout.tsx` (auth-aware routing)

```mermaid
sequenceDiagram
  participant User
  participant App
  participant SupabaseAuth

  User->>App: Submit register form (email/password)
  App->>SupabaseAuth: signUp(email, password)
  SupabaseAuth-->>App: data + error
  alt error
    App-->>User: Alert with error message
  else session is null
    App-->>User: "Check your inbox" alert
    App->>App: router.replace('/(auth)/login')
  else session exists
    App->>App: router.replace('/(tabs)/home')
  end
```

## Login flow

Code references:

- `app/(auth)/login.tsx`

```mermaid
sequenceDiagram
  participant User
  participant App
  participant SupabaseAuth

  User->>App: Submit login form
  App->>SupabaseAuth: signInWithPassword(email, password)
  SupabaseAuth-->>App: success/error
  alt success
    App->>App: router.replace('/(tabs)/home')
  else failure
    App-->>User: Alert error
  end
```

## Session-aware route guarding

Code references:

- `app/_layout.tsx`

On app startup:

1. Loads session via `supabase.auth.getSession()`
2. Subscribes to `onAuthStateChange`
3. Redirects based on current route segment:
   - unauthenticated users -> `/(auth)/login`
   - authenticated users in auth screens -> `/(tabs)/home`
