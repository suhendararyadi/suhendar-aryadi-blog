# Design Specification: Mandatory Student Class Identity System

**Date**: 2026-08-08  
**Target Files**:
- `src/lib/auth.ts` (Update authentication check to enforce class_name)
- `src/pages/auth/login.astro` (Add class requirement check & completion flow)
- `src/pages/auth/register.astro` (Make class dropdown mandatory)
- `src/pages/api/auth/login.ts` (Return requiresClass flag if class_name is empty)
- `src/pages/api/auth/update-class.ts` (New API route to save class selection)
- `src/pages/dashboard.astro` (Session check: enforce class completion or force logout)
- `src/pages/belajar/index.astro` (Session check: enforce class completion or force logout)

**Author**: Antigravity Assistant & Suhendar Aryadi, S.Pd.,Gr.

---

## 1. Overview & Objectives

Class identity (`class_name`) is now a **strictly mandatory** field for all student accounts:
1. **Force Logout Existing Students Without Class**: Any logged-in student whose `class_name` is NULL or empty will be automatically logged out upon accessing `/dashboard` or `/belajar`.
2. **Mandatory Class Select on Registration**: Registration form requires selecting a valid class.
3. **Login Interception & Completion**: During login, if `class_name` is missing, the student is immediately prompted to select their class before granting access.

---

## 2. Standardized SMK Class Options

- `X RPL 1`
- `X RPL 2`
- `X TKT 1`
- `X TKT 2`
- `XI RPL 1`
- `XI RPL 2`
- `XII RPL 1`
- `XII RPL 2`
- Custom input fallback

---

## 3. Workflow & Verification

1. **Register**: `class_name` field is a required dropdown select.
2. **Login API**: Checks `user.class_name`. If missing, returns `{ requiresClass: true, userId: user.id }`.
3. **Session Check Enforcement**: `getSessionUser()` or frontmatter checks enforce `class_name`. If missing, clear cookie and redirect to `/auth/login?reason=missing_class`.
