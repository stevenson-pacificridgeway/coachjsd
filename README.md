# CoachJSD

The premium online home for Coach JSD — nutrition & fitness coaching.
Static, fast, fully responsive front-end (Apple-meets-Airbnb aesthetic, cobalt accent),
served by a tiny zero-dependency Node server so it deploys cleanly to Railway.

## Pages
- `index.html` — Homepage (hero → social proof → transformations → how it works → programs → testimonials → meet JSD → meal plans → workout plans → FAQ → final CTA → footer)
- `programs.html` — Coaching programs + digital storefront
- `transformations.html` — Filterable before/after gallery
- `assets/` — `styles.css` (design system), `pages.css` (page styles), `main.js` (interactions)
- `server.js` — static file server (`npm start`)
- `supabase/schema.sql` — backend schema for client logins, products, tracking (run when you add the portal)

## Run locally
```bash
npm start
# open http://localhost:3000
```
No build step, no dependencies.

## Push from your Terminal (GitHub)
From the project folder:
```bash
git init
git add .
git commit -m "CoachJSD initial launch"
git branch -M main
# create an empty repo at github.com/new called "coachjsd", then:
git remote add origin https://github.com/YOUR_USERNAME/coachjsd.git
git push -u origin main
```

## Deploy to Railway
Option A — dashboard (easiest):
1. railway.app → New Project → Deploy from GitHub repo → pick `coachjsd`.
2. Railway auto-detects Node, runs `node server.js` (see `railway.json`).
3. Settings → Networking → Generate Domain (or add `coachjsd.com`).

Option B — CLI:
```bash
npm i -g @railway/cli
railway login
railway init
railway up
railway domain
```

## Point your Namecheap domain
1. In Railway: Settings → Networking → Custom Domain → enter `coachjsd.com` → copy the CNAME target.
2. In Namecheap: Domain List → Manage → Advanced DNS → add a CNAME record
   (`www` → the Railway target) and a redirect/ALIAS for the root domain.
3. Wait for DNS to propagate (usually minutes).

## Adding the backend later (Supabase)
1. supabase.com → New Project. Copy the Project URL + anon key.
2. SQL Editor → paste `supabase/schema.sql` → Run. (Or `supabase db push`.)
3. Enable Supabase Auth (email/password + magic link) for client logins.
4. Add the Supabase JS client to a new `app/` (client dashboard) using the anon key.
5. For payments, connect Stripe and store `stripe_price_id` on each product row.

## What's placeholder (swap when ready)
- Every gray/blue block labeled with text is an image slot — drop real photos into `assets/img/` and replace the `.ph` divs with `<img>`.
- Copy, testimonials, prices, and credentials are on-brand placeholders — edit freely.
