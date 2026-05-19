# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server at localhost:5173
npm run build      # production build (output: dist/)
npm run lint       # ESLint check across all js/jsx files
npm run preview    # serve the production build locally
```

No test runner is configured yet.

## Architecture

### Provider tree (`src/main.jsx`)
The render order is fixed and matters:
```
QueryClientProvider → AuthProvider → RouterProvider
```
`AuthProvider` must sit inside `QueryClientProvider` so hooks inside auth context can use TanStack Query if needed. `RouterProvider` is the outermost React Router entry point — there is no `<App />` wrapper.

### Routing (`src/router.jsx`)
All routes live in a single `createBrowserRouter` array. Public routes (`/`, `/login`) render their page directly. Every other route wraps its page in `<ProtectedRoute>`, which reads auth state from `useAuth()` and redirects to `/login` when unauthenticated. To add a new protected page: create the file in `src/pages/`, import it in `router.jsx`, and wrap it with `<ProtectedRoute>`.

### Auth (`src/context/AuthContext.jsx`)
`AuthProvider` initialises from `supabase.auth.getSession()` on mount and subscribes to `onAuthStateChange` for the session lifetime. The `loading: true` state while the initial session resolves is what `ProtectedRoute` uses to show a spinner instead of flashing a redirect. Always consume auth state via the `useAuth()` hook — never call `supabase.auth.getUser()` or `getSession()` directly inside components.

### Data fetching
All Supabase database reads/writes should be wrapped in custom hooks inside `src/hooks/` using TanStack Query (`useQuery` / `useMutation`). The singleton Supabase client is exported from `src/lib/supabaseClient.js` and is the only import point.

### Styling
Tailwind CSS v3 (PostCSS-based, not the Vite plugin). Custom design tokens defined in `tailwind.config.js`:
- `primary-{50…950}` — electric blue scale (use `primary-600` / `primary-700` for interactive elements)
- `surface` / `surface-100` / `surface-200` — page and card backgrounds
- `muted` / `muted-foreground` — secondary and tertiary text

### Environment variables
Prefixed with `VITE_` per Vite convention. Required at runtime:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Set in `.env.local` (gitignored). See `.env.example` for the key names.
