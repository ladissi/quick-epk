# QuickEPK.com - MVP Implementation Plan

## Overview
Build a musician EPK (Electronic Press Kit) builder with view analytics tracking. Core differentiator: artists know when bookers view their EPK and what they engage with.

## Tech Stack (All Free Tier)
- **Frontend/Backend**: Next.js 14+ with App Router, TypeScript
- **Database + Auth**: Supabase (500MB free, 50K monthly active users)
- **Hosting**: Vercel (free tier)
- **Image Storage**: Supabase Storage (1GB free)
- **Styling**: Tailwind CSS
- **Analytics Tracking**: Custom implementation with Supabase

## Database Schema

```sql
-- Users (artists)
users (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  created_at timestamp
)

-- EPKs
epks (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  slug text UNIQUE,  -- quickepk.com/artist-name
  artist_name text,
  bio text,
  genre text,
  location text,
  photos jsonb,      -- array of image URLs
  music_links jsonb, -- spotify, soundcloud, etc
  video_links jsonb, -- youtube embeds
  social_links jsonb,
  contact_email text,
  is_published boolean DEFAULT false,
  created_at timestamp,
  updated_at timestamp
)

-- View Analytics
epk_views (
  id uuid PRIMARY KEY,
  epk_id uuid REFERENCES epks,
  viewer_ip text,      -- for uniqueness (hashed)
  viewer_location text,
  referrer text,
  user_agent text,
  viewed_at timestamp,
  time_on_page integer, -- seconds
  sections_viewed jsonb -- which parts they looked at
)

-- Click Analytics
epk_clicks (
  id uuid PRIMARY KEY,
  epk_id uuid REFERENCES epks,
  view_id uuid REFERENCES epk_views,
  element_type text,   -- 'music', 'video', 'social', 'contact'
  element_url text,
  clicked_at timestamp
)
```

## Project Structure

```
/quick-epk
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # EPK list + analytics overview
│   │   │   ├── epk/
│   │   │   │   ├── new/page.tsx        # Create EPK
│   │   │   │   └── [id]/
│   │   │   │       ├── edit/page.tsx   # Edit EPK
│   │   │   │       └── analytics/page.tsx
│   │   ├── [slug]/
│   │   │   └── page.tsx                # Public EPK view (tracked)
│   │   └── api/
│   │       ├── track/
│   │       │   ├── view/route.ts       # Track page views
│   │       │   └── click/route.ts      # Track clicks
│   │       └── epk/
│   │           └── route.ts            # CRUD operations
│   ├── components/
│   │   ├── epk/
│   │   │   ├── EPKForm.tsx             # Create/edit form
│   │   │   ├── EPKPreview.tsx          # Live preview
│   │   │   └── EPKPublicView.tsx       # Public display
│   │   ├── dashboard/
│   │   │   ├── AnalyticsCard.tsx
│   │   │   └── EPKList.tsx
│   │   └── ui/                         # Reusable components
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── analytics.ts                # Tracking utilities
│   │   └── utils.ts
│   └── types/
│       └── index.ts                    # TypeScript types
├── public/
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## Implementation Phases

### Phase 1: Project Setup (Day 1)
1. Initialize Next.js project with TypeScript
2. Set up Supabase project and database schema
3. Configure Tailwind CSS
4. Set up environment variables
5. Create Supabase client utilities

### Phase 2: Authentication (Day 1-2)
1. Implement Supabase Auth (email/password)
2. Create login/signup pages
3. Add auth middleware for protected routes
4. Create user session management

### Phase 3: EPK Builder (Day 2-4)
1. Create EPK form with sections:
   - Artist name, bio, genre, location
   - Photo uploads (up to 5)
   - Music links (Spotify, SoundCloud, Apple Music, Bandcamp)
   - Video embeds (YouTube, Vimeo)
   - Social links (Instagram, Twitter, TikTok, Facebook)
   - Contact email
2. Real-time preview component
3. Save as draft / publish toggle
4. Custom slug selection

### Phase 4: Public EPK Display (Day 4-5)
1. Clean, responsive public EPK template
2. Embedded music players
3. Video embeds
4. Photo gallery
5. Contact button
6. Mobile-optimized layout

### Phase 5: Analytics Tracking (Day 5-6)
1. Track page views on EPK load
2. Track time on page (beacon on unload)
3. Track clicks on music/video/social/contact
4. Capture referrer and location (via IP geolocation API - free tier)
5. Store in Supabase

### Phase 6: Analytics Dashboard (Day 6-7)
1. Total views, unique views
2. Views over time chart
3. Top referrers
4. Click breakdown by element type
5. Recent views list with timestamps

### Phase 7: Landing Page & Polish (Day 7-8)
1. Marketing landing page
2. Pricing section (Free tier messaging, Pro coming soon)
3. Example EPK showcase
4. Polish UI/UX
5. Add loading states, error handling

## Key Files to Create

| File | Purpose |
|------|---------|
| `src/app/[slug]/page.tsx` | Public EPK with tracking |
| `src/app/dashboard/page.tsx` | User dashboard with analytics |
| `src/app/dashboard/epk/new/page.tsx` | EPK creation form |
| `src/components/epk/EPKForm.tsx` | Multi-section EPK editor |
| `src/components/epk/EPKPublicView.tsx` | Public template |
| `src/lib/supabase/client.ts` | Supabase browser client |
| `src/lib/analytics.ts` | View/click tracking functions |
| `src/app/api/track/view/route.ts` | View tracking endpoint |

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://quickepk.com
```

## MVP Feature Checklist

- [x] User signup/login
- [x] Create EPK with all fields
- [x] Edit existing EPK
- [x] Custom slug (quickepk.com/your-name)
- [x] Publish/unpublish toggle
- [x] Public EPK page (beautiful, responsive)
- [x] View tracking (unique + total)
- [x] Click tracking (music, video, social, contact)
- [x] Analytics dashboard (views over time, clicks by type)
- [x] Landing page

## Post-MVP (Week 2+)
- Stripe payments for Pro tier
- AI bio generator
- Multiple EPK templates
- Custom domains
- PDF export
- Email notifications on views

## Verification Steps

1. Create account, verify email login works
2. Create EPK with all fields populated
3. Publish EPK and visit public URL
4. Verify analytics track the view
5. Click music/social links, verify clicks tracked
6. Check dashboard shows accurate analytics
7. Test on mobile devices
8. Test with fresh browser (no auth) viewing public EPK

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel
4. Deploy
5. Add custom domain (quickepk.com) when ready

---

## Supabase Project Details

- **Project Name**: quick-epk
- **Project Ref**: tgwhyovjppcsljyiafab
- **Region**: us-east-1
- **Dashboard**: https://supabase.com/dashboard/project/tgwhyovjppcsljyiafab
