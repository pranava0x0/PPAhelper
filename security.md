# security.md

Last sweep: **2026-06-01**

## Dependency posture
- **Zero third-party runtime dependencies.** No npm packages, no CDN assets, no web fonts, no analytics. The site is hand-written HTML/CSS/vanilla JS using system font stacks only.
- Because nothing is fetched from a third-party origin at runtime, there are **no Subresource Integrity (SRI) hashes to maintain** and **no supply-chain install step** (`npm install` / `pip install`) in the build — there is no build.
- No secrets, API keys, or credentials are used or stored. `.gitignore` covers `.env*`, `credentials.json`, `secrets/` as a precaution.

## If dependencies are added later
- Check the advisory index at `https://pranava0x0.github.io/vibe-coding-security/llms-ctx.txt` before any install, and record the match check here.
- Pin exact versions + lockfile installs; add `sha384` SRI to any CDN asset; self-host where feasible.
- Refresh this sweep date whenever dependencies change or at least every 7 days while actively developing.

## Data handling
- All content is static and public (educational). No user data is collected or transmitted. Theme preference is stored in `localStorage` only.
