# AI Prompts (with Reasoning) — Ledgerlite MERN


---

## Prompt 1 — Postman Collection & Environment Sanity

**Prompt:**  
Validate my Postman collection setup. My requests use `{{baseUrl}}/api/...`. Tell me exactly what the environment `baseUrl` must be in dev, how to store `{{token}}` after login in Tests, and how to run the collection end-to-end.

**Reasoning:**  
Misconfigured environments often cause `/api/api/...` URLs and broken auth. This prompt ensures a reliable, repeatable Postman flow (Health → Register → Login → Expenses) and correct token handling for teammates and graders.

---

## Prompt 2 — Client Login Fails but Postman Works

**Prompt:**  
The API works in Postman, but my React login says “Login failed”. Update my axios client to:  
- Use `import.meta.env.VITE_API_BASE || "http://localhost:5000/api"`  
- Attach `Authorization` if a token exists  
- Log `[API ERROR]` with URL/status/response  
Update the Login page to show the real server error (`error`/`message`) when present.

**Reasoning:**  
If Postman passes and the UI fails, the issue is usually base URL, missing headers, or swallowed errors. Surfacing the true backend message unblocks debugging immediately.

---

## Prompt 3 — Add Server-Side Date Filters (`from` / `to`) to GET /expenses

**Prompt:**  
Add `from`/`to` query params to `GET /api/expenses` so it filters by `createdAt`. Validate bad dates (return 400). Then show the client changes: two `<input type="date">` fields and passing `from`/`to` (YYYY-MM-DD) to the API.

**Reasoning:**  
Monthly/period views should be filtered at the source to reduce payloads and keep time boundaries consistent across the app.

---

## Prompt 4 — Auth Flow with `authChange` Event

**Prompt:**  
Update my Login page to save `{ token, user }`, dispatch `window.dispatchEvent(new Event("authChange"))`, and navigate to `/dashboard`. Provide a small `useAuth` hook that listens to both `storage` and `authChange` to keep the UI in sync across tabs.

**Reasoning:**  
A global auth event ensures headers/nav/routes react instantly to login/logout without page refreshes, preventing stale UI states.

---

## Prompt 5 — Descriptive Dashboard with Minimal Components

**Prompt:**  
Add `StatCard`, `Badge`, `EmptyState`, and `Spinner` components and wire them into the Dashboard: show page totals (INR), reimbursable counts, filter badges, and clear loading/empty states. Keep Tailwind classes minimal; no extra packages.

**Reasoning:**  
Small reusable UI atoms improve readability and maintainability without bloating the stack or introducing new dependencies.

---

## Prompt 6 — Analytics Page with Recharts (+ Pie Clipping Fix)

**Prompt:**  
Create `Analytics.jsx` that fetches up to 1000 expenses over a selected date range and renders:  
- Line chart (spend over time)  
- Bar chart (totals by category)  
- Pie (reimbursable split) with margins/radius so labels don’t clip  
Use Recharts only.

**Reasoning:**  
Visuals turn raw records into insights. The margin/radius notes avoid the common pie-label clipping issue and make charts presentation-ready.

---

## Prompt 7 — Landing Page + Routing

**Prompt:**  
Build a landing page (no navbar) with a hero tagline, 6 feature cards, and “Get Started” / “Create Account” CTAs. Update routes so unauthenticated users see `/`, authenticated users are redirected to `/dashboard` (with `/analytics` protected too).

**Reasoning:**  
A friendly intro page sets expectations and improves onboarding. Proper routing separates public vs. protected areas cleanly.

---

## Prompt 8 — Revert Theme to Light (Emergency Reset)

**Prompt:**  
Revert to a clean light theme: provide minimal `index.css`, a correct Tailwind config, and find/replace steps to restore light cards/inputs/tables in Dashboard and Analytics (keep chart margin fixes).

**Reasoning:**  
When experiments make the UI unreadable, a fast, deterministic reset prevents deadline slip and restores clarity.

---

## Prompt 9 — Maintain a Running Feature Log

**Prompt:**  
Generate/update `/docs/FEATURE_LOG.md` with: implemented backend features, implemented frontend features, smoke tests, backlog, README outline, and a short demo script. Append a timestamped checkpoint for the latest UI/route changes.

**Reasoning:**  
A living feature log turns into the README + demo script later, saving time and ensuring consistent documentation.

---

## Prompt 10 — Fix NPM `SELF_SIGNED_CERT_IN_CHAIN` / Proxy Issues

**Prompt:**  
NPM install fails with `SELF_SIGNED_CERT_IN_CHAIN`. Give me a quick temporary workaround and the proper fix by trusting the corporate root CA, plus proxy settings if needed.

**Reasoning:**  
Corporate TLS inspection often injects a custom CA that Node/NPM don’t trust. Documenting both a quick unblock and the correct CA-trust configuration prevents repeated setup blockers on teammate machines.
