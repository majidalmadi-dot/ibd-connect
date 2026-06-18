# GitHub → Vercel auto-deploy

Once this folder is a GitHub repo connected to Vercel, **every `git push` auto-deploys** to https://ibd-connect.vercel.app — no token needed again.

`.gitignore` is already set (ignores node_modules, build artifacts, `.vercel*`, and the source deck).

## 1) Push this folder to GitHub (run on your Mac, in the IBD App folder)

**Option A — GitHub CLI (`gh`), one shot:**
```bash
cd "~/Library/Mobile Documents/com~apple~CloudDocs/Desktop/IBD application/IBD App"
git init && git add . && git commit -m "IBD Connect: web app + RN app"
gh repo create ibd-connect --public --source=. --remote=origin --push
```

**Option B — manual:** create an empty repo at github.com/new (name it `ibd-connect`), then:
```bash
cd "~/Library/Mobile Documents/com~apple~CloudDocs/Desktop/IBD application/IBD App"
git init && git add . && git commit -m "IBD Connect: web app + RN app"
git branch -M main
git remote add origin https://github.com/<your-username>/ibd-connect.git
git push -u origin main
```

## 2) Connect the repo to the existing Vercel project
- **Dashboard:** vercel.com → project `ibd-connect` → Settings → Git → Connect the `ibd-connect` repo. Keep build settings: framework **Other**, output dir `.` (already in `vercel.json`).
- **Or tell Claude** the repo URL and Claude will run `vercel git connect <url>` with your token to link it.

After connecting, the first push deploys automatically and the URL stays `ibd-connect.vercel.app`.

## Notes
- The repo includes both the web app (`ibd-connect.html` / `index.html`) and the React Native app (`ibd-connect-rn/`). Vercel only serves the static web root.
- Never commit Vercel/GitHub tokens. `.gitignore` already excludes `.vercel/` and `.vercel-web/`.
