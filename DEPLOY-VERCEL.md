# Deploy noctra to Vercel

1. Run `npm install`
2. Push this folder to a GitHub repo
3. On vercel.com → Add New Project → import the repo
4. Add Environment Variables (Project → Settings → Environment Variables):
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_PUBLISHABLE_KEY
   - VITE_SUPABASE_PROJECT_ID
   (values are in the original `.env`)
5. Deploy

The AI edge function (`analyze-vibe`) stays on Lovable Cloud and is called from the Vercel frontend via Supabase — no extra setup.
