# IBD Connect — deployment

## Live web app (Vercel — primary)
- **URL:** https://ibd-connect.vercel.app
- **Host:** Vercel (team: majidalmadi-9920s-projects, project `ibd-connect`)
- **Dashboard:** https://vercel.com/majidalmadi-9920s-projects/ibd-connect
- Mobile-optimised: safe-area/notch handling, full-bleed on phones, no input zoom.
- **Redeploy:** `cd "IBD App" && cp ibd-connect.html .vercel-web/ibd-connect/index.html && (cd .vercel-web && npx vercel deploy ibd-connect --prod --yes --token=YOUR_TOKEN)`
  (create a token at vercel.com/account/tokens; never commit it)

## Live web app (Netlify — mirror)
- **URL:** https://ibd-connect.netlify.app
- **Host:** Netlify (your connected team)
- **Netlify site id:** `9f222eb4-0e26-4c1d-82b8-c9d4a8018996`
- **Dashboard:** https://app.netlify.com/projects/ibd-connect

## What is deployed
The single-file web app `ibd-connect.html`, published from `site/index.html`
(`site/` is the Netlify publish folder; `netlify.toml` sets `publish = "site"`).
The React Native project in `ibd-connect-rn/` is **not** part of this web deploy.

## Iterate → redeploy
1. Edit `ibd-connect.html`.
2. Copy it into the publish folder:  `cp ibd-connect.html site/index.html`
3. Ask Claude to "redeploy", or run a Netlify deploy of the `site/` folder against
   site id `9f222eb4-0e26-4c1d-82b8-c9d4a8018996` (Claude triggers this via the
   Netlify connector each time, which issues a short-lived deploy token).

## Custom domain (optional)
Add a domain under the Netlify dashboard → Domain management, or ask Claude to
rename the project (changes the `*.netlify.app` subdomain).
