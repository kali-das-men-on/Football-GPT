# Football GPT — frontend

React app built with Vite. Talks to the `backend/` FastAPI app in this same repo.

## Local development

```bash
cd frontend
npm install
cp .env.example .env     # edit VITE_API_BASE if your backend isn't on localhost:8000
npm run dev
```

Opens on `http://localhost:5173`. Run the backend separately, from the repo root:

```bash
uvicorn backend.main:app --reload --port 8000
```

## Deploying to Vercel

1. Push this repo to GitHub (see the root-level git commands below).
2. In Vercel: **New Project** → import this repo.
3. **Root Directory**: set to `frontend` — Vercel needs to know the app isn't
   at the repo root, since `backend/` lives alongside it.
4. Framework preset: Vite (Vercel usually detects this automatically).
5. Under **Environment Variables**, add:
   `VITE_API_BASE` = your Render backend's URL (e.g. `https://football-gpt-backend.onrender.com`)
6. Deploy. Vercel gives you a URL like `https://football-gpt.vercel.app`.

**After it's live**, go back to `backend/main.py` and change
`allow_origins=["*"]` to `allow_origins=["https://football-gpt.vercel.app"]`
(your actual Vercel URL), then redeploy the backend on Render. `"*"` works
for testing but shouldn't stay on anything you're actually sharing.
