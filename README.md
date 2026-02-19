# Smart Bookmark App

A real-time, secure bookmark manager built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- **Authentication**: Secure Google OAuth login via Supabase.
- **Privacy**: Bookmarks are protected by Row Level Security (RLS) - only you can see your bookmarks.
- **Real-time**: Updates instantly across all your devices and tabs without refreshing.
- **Responsive**: Beautifully designed interface that works on mobile and desktop.

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js installed
- A Supabase project

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Khushi-83/Smart-Bookmark.git
   cd smart-bookmark
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Rename `.env.local.example` to `.env.local` and add your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Setup Database:
   Run the SQL queries found in `supabase/schema.sql` in your Supabase project's SQL Editor to create the table and policies.

5. Configure Google Auth:
   - Go to Supabase Dashboard -> Authentication -> Providers -> Google.
   - Enable it and add your Client ID and Secret (from Google Cloud Console).
   - Add `http://localhost:3000/auth/callback` to the Redirect URLs in Supabase.

6. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

This app is ready to be deployed on Vercel.

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables in Vercel project settings.
4. Deploy!

## Challenges & Solutions

### 1. Real-time Updates Consistency
**Challenge:** Bookmarks weren't updating in real-time across devices, requiring a manual page refresh. This was particularly problematic on secondary devices where the connection would instability or updates wouldn't appear at all.
**Solution:**
- **Client Instantiation Fix:** Moved the `createClient` call inside a `useState` hook in `BookmarkList.tsx`. This prevents the Supabase client from being re-instantiated on every render, which was causing the Realtime connection to constantly reset and fail on some devices.
- Implemented Supabase Realtime subscriptions in `BookmarkList.tsx` using the `postgres_changes` event.
- Ensured the `bookmarks` table had "Realtime" enabled in the Supabase Dashboard.
- Correctly handled `INSERT` and `DELETE` payloads to update the React state instantly without refetching.

### 2. Row Level Security (RLS) Policies
**Challenge:** ensuring users can only manage their own data securely.
**Solution:**
- Enabled RLS on the `bookmarks` table.
- Added authenticated-only policies:
  - `SELECT`: `auth.uid() = user_id`
  - `INSERT`: `auth.uid() = user_id`
  - `DELETE`: `auth.uid() = user_id`

