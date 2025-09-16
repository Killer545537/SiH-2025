# PM Internship Recommender

A lightweight, AI-assisted recommendation system for the PM Internship Scheme. Given a candidate’s education, skills, interests, and location preferences, it aims to suggest the top 3–5 most relevant internships in a simple, mobile-friendly, and accessible format.

This repository is structured as a small monorepo with two services:

- web: Next.js app (frontend + server actions/backend)
- ai: FastAPI service (Python) for recommendation logic

## Table of Contents

- Overview
- Stack and Components
- Requirements
- Setup and Run
  - Run with Docker
  - Run locally without Docker
- Scripts
- Environment Variables
- Tests
- Project Structure
- License
- TODOs

## Overview

- Frontend is a Next.js 15 app (TypeScript-ready) with TailwindCSS configuration present in devDependencies. It also integrates Better-Auth, Drizzle ORM, and Neon (PostgreSQL) per package.json.
- AI service is a FastAPI app running with uvicorn. It currently exposes a health endpoint (/ping). The recommendation logic is not implemented yet.
- docker-compose is provided to run both services together.

## Stack and Components

### Web (Frontend + server actions)

- Framework: Next.js 15
- Language: TypeScript/JavaScript
- Package manager: pnpm (declared in package.json: packageManager pnpm@10.16.0)
- Key libs:
  - Auth: better-auth
  - Database: Neon (PostgreSQL) via @neondatabase/serverless
  - ORM: drizzle-orm with drizzle-kit
  - Styling: TailwindCSS
- Entrypoint (Docker): node server.js (Next.js standalone output)
- Default port: 3000

### AI Service

- Language/runtime: Python 3.13
- Tooling: uv (dependency manager/runtime)
- Framework: FastAPI + uvicorn
- Entrypoint: python -m src.main which runs uvicorn for app src.api:app
- Default port: 8000
- Health: GET /ping → {"status":"ok"}

## Requirements

- Docker (and Docker Compose plugin)
- Alternatively for local dev:
  - Node.js 20.x
  - pnpm 10.x (per package.json)
  - Python 3.13
  - uv (https://github.com/astral-sh/uv)

## Setup and Run

### Run with Docker (recommended)

1. Ensure web/.env is configured (see Environment Variables below).
2. From repository root, build and start:
   docker compose up --build
3. Services:
   - Web: http://localhost:3000
   - AI: http://localhost:8000 (health check at /ping)

### Run locally without Docker

Web app:

1. cd web
2. Install deps (pnpm is recommended to match the lockfile):
   pnpm install
3. Create and populate .env (see Environment Variables). Then start dev server:
   pnpm dev
   - Prod build/start:
     pnpm build
     pnpm start

AI service:

1. cd ai
2. Sync Python deps with uv (uses pyproject.toml):
   uv sync
3. Run the service:
   uv run python -m src.main
   - The server listens on 0.0.0.0:8000; test with:
     curl http://localhost:8000/ping

## Scripts

Web package.json scripts (cd web):

- dev: next dev --turbopack
- build: next build --turbopack
- start: next start
- lint: eslint
- drizzle:generate: drizzle-kit generate
- drizzle:migrate: drizzle-kit migrate
- drizzle:push: drizzle-kit push
- drizzle:studio: drizzle-kit studio

AI service scripts:

- No npm scripts; use uv to run:
  - uv run python -m src.main

## Project Structure

- README.md
- docker-compose.yml
- ai/
  - Dockerfile
  - pyproject.toml
  - src/
    - api.py (FastAPI app, /ping)
    - main.py (uvicorn runner)
- web/
  - Dockerfile (multi-stage: deps, build, runner; outputs Next.js standalone server.js)
  - package.json (Next 15, React 19, Drizzle, Better-Auth; pnpm)
  - .env (local env file; consider creating an .env.example)
  - app/ (main Next.js logic)
