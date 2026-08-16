# Manobhav AI

> Understand the emotion behind your words.

An NLP emotion-classification web app. The frontend (this repo) is Next.js +
GSAP + React Three Fiber; it talks to your existing FastAPI + BiGRU backend
over `POST /predict`. **No ML code lives in this repo — inference always
happens on your Python backend.**

---

## 1. Project structure

```
manobhav-ai/
├── app/
│   ├── layout.js
│   ├── page.js
│   └── globals.css
├── components/
│   ├── Navbar.jsx / .module.css
│   ├── Hero.jsx / .module.css
│   ├── EmotionSphere.jsx          # lightweight Three.js hero visual
│   ├── EmotionAnalyzer.jsx / .module.css
│   ├── EmotionResult.jsx / .module.css
│   ├── ProbabilityChart.jsx / .module.css
│   ├── HowItWorks.jsx / .module.css
│   ├── TechStack.jsx / .module.css
│   ├── About.jsx / .module.css
│   └── Footer.jsx / .module.css
├── lib/
│   ├── api.js          # centralized fetch layer for /predict and /health
│   ├── emotions.js      # shared emotion labels, colors, emojis
│   └── gsapConfig.js    # registers GSAP ScrollTrigger once, client-side
├── backend-deploy/
│   ├── requirements.txt
│   └── runtime.txt
├── .env.local.example
├── jsconfig.json
├── next.config.js
└── package.json
```

## 2. Local development

**Frontend**

```bash
npm install
cp .env.local.example .env.local
# edit .env.local if your backend isn't on http://127.0.0.1:8000
npm run dev
```

Visit `http://localhost:3000`.

**Backend** (your existing FastAPI app)

```bash
uvicorn main:app --reload --port 8000
```

Confirm `http://127.0.0.1:8000/health` responds before testing the UI.

## 3. Environment variables

| Variable | Local value | Production value |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8000` | Your Render backend URL |

Never hardcode the Render URL in components — `lib/api.js` is the only place
that reads `NEXT_PUBLIC_API_URL`.

## 4. Deploying the frontend to Vercel

1. Push this repo to GitHub.
2. In Vercel: **New Project → Import** this repo.
3. Framework preset: Next.js (auto-detected).
4. Add environment variable: `NEXT_PUBLIC_API_URL` = your Render backend URL
   (e.g. `https://manobhav-ai-backend.onrender.com`).
5. Deploy. Vercel builds with `next build` and serves automatically.

## 5. Deploying the FastAPI backend to Render

1. **Repository structure** — your backend repo (separate from this frontend
   repo, or a `backend/` folder in a monorepo) should contain:
   ```
   main.py
   requirements.txt
   runtime.txt
   Artifacts/
     bigru_model.keras
     tokenizer.pkl
   ```
2. **Build command:**
   ```
   pip install -r requirements.txt
   ```
3. **Start command:**
   ```
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
   Render injects `$PORT` at runtime — do not hardcode a port number.
4. **Python runtime:** set via `runtime.txt` → `python-3.11.9`, which is
   compatible with `tensorflow-cpu==2.15.0` in `backend-deploy/requirements.txt`.
   Use `tensorflow-cpu` instead of `tensorflow` on Render — it's a much
   smaller install and Render's free/standard instances have no GPU anyway.
5. **Environment variables:** none are strictly required unless your backend
   reads config from the environment (e.g. a CORS origin list). If so, add a
   variable like `ALLOWED_ORIGINS=https://your-vercel-app.vercel.app`.
6. **CORS:** make sure your FastAPI app's `CORSMiddleware` allow-list
   includes your Vercel domain, e.g.:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-vercel-app.vercel.app", "http://localhost:3000"],
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
7. **Model/artifact files:** `bigru_model.keras` and `tokenizer.pkl` can be
   committed directly to GitHub if each file is under ~100 MB (GitHub's hard
   per-file limit; Git LFS is recommended once you're above ~50 MB). If your
   model exceeds that, use **Git LFS** or host the file externally (e.g. a
   private S3/GCS bucket or Hugging Face Hub) and download it at startup in
   `main.py` before the app starts serving requests.
8. **Health check endpoint:** point Render's health check at `/health` so it
   only routes traffic once your model has finished loading.

## 6. Local development commands

```bash
npm run dev      # start Next.js dev server
npm run build    # production build
npm run start    # run the production build locally
npm run lint     # lint
```

## 7. Checklist

- [ ] Frontend works locally
- [ ] FastAPI backend works locally
- [ ] `/health` works
- [ ] `/predict` works
- [ ] Frontend communicates with `/predict`
- [ ] GSAP animations work
- [ ] Responsive design works
- [ ] Production API URL uses environment variables
- [ ] Render deployment is configured
- [ ] Vercel deployment is configured
- [ ] README is included

---

Built with Next.js, GSAP, React Three Fiber, and a BiGRU emotion model.
