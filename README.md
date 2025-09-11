# PM Internship Recommender

## Problem Statement

Youth applying to the PM Internship Scheme often struggle to identify suitable internships due to limited digital exposure, lack of prior experience, and hundreds of scattered listings. This leads to misaligned applications and missed opportunities. The challenge is to build a lightweight, AI-assisted recommendation system that, based on a candidate’s education, skills, interests, and location preferences, suggests the top 3–5 most relevant internships in a simple, mobile-friendly, and accessible format.

---

# Components

## Frontend

- _Framework:_ Next.js with TypeScript
- _UI:_ ShadCN components + TailwindCSS
- _Features:_
  - Minimal, mobile-friendly design
  - Simple onboarding flow for candidate input (education, skills, interests, location)
  - Recommendations displayed as cards or a short list with clear actions
  - Multilingual support for regional accessibility

## Backend

- _Auth:_ Better-Auth for secure login/signup
- _Database:_ Neon (PostgreSQL)
- _ORM:_ DrizzleORM for schema management and queries
- _APIs:_ Next.js server actions for CRUD operations (candidates, internships, applications)
- _Responsibilities_:
  - Manage user profiles and internship listings
  - Store candidate data (education, skills, preferences)
  - Expose endpoints that communicate with the AI service

## AI Service

- _Language:_ Python (managed with `uv`)
- _Framework:_ FastAPI for serving the model as REST API
- _Dependencies:_ scikit-learn / pandas for lightweight ML or rule-based matching
- _Responsibilities:_
  - Process candidate inputs (education, skills, interests, location)
  - Run a simple recommendation engine (ML-light or rule-based)
  - Return top 3–5 internships as JSON

---

