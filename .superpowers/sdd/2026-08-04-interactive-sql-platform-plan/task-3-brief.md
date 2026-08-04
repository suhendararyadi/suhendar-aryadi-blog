# Task 3 Brief: Authentication System (lib/auth.ts, API, & Pages)

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/pages/api/auth/register.ts`
- Create: `src/pages/api/auth/login.ts`
- Create: `src/pages/api/auth/logout.ts`
- Create: `src/pages/auth/register.astro`
- Create: `src/pages/auth/login.astro`

**Interfaces:**
- Consumes: `users` dan `sessions` DB tables, `bcryptjs`
- Produces: Registration, login, logout, & session verification helpers

## Requirements:
1. Create `src/lib/auth.ts`:
   - `hashPassword(password)` & `verifyPassword(password, hash)` using `bcryptjs`.
   - `createSession(userId)` returning hex session ID stored in `sessions` table (30 days expiry).
   - `getSessionUser(sessionId)` joining `sessions` & `users` tables.
   - `destroySession(sessionId)`.
2. Create API endpoints:
   - `src/pages/api/auth/register.ts`: POST endpoint registering user, creating session, setting `session_id` HTTP-only cookie.
   - `src/pages/api/auth/login.ts`: POST endpoint verifying password, creating session, setting cookie.
   - `src/pages/api/auth/logout.ts`: POST endpoint deleting session from DB and clearing cookie.
3. Create UI Pages:
   - `src/pages/auth/register.astro`: Styled registration form for RPL students.
   - `src/pages/auth/login.astro`: Styled login form for RPL students.
4. Verify with `npx astro check` and `npm run build`.
5. Commit changes with message `feat: implement authentication system (register, login, logout, session cookies)`.
6. Write report to `/Users/suhendararyadi/Documents/Coding/Web Suhendar Aryadi/.superpowers/sdd/2026-08-04-interactive-sql-platform-plan/task-3-report.md`.
