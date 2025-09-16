# AI BASED RECOMMENDATION SYSTEM FOR PM INTERNSHIP SCHEME

This README provides an overview of the project, including team details, relevant links, tasks completed, tech stack, key features, and steps to run the project locally or deploy with Docker.

## Team Details

Team Name: FULL ML Alchemist

Team Leader: @MAYANKCHORADIA

Team Members:

MAYANK CHORADIA - 2023UCM2305 - @MAYANKCHORADIA

JOY KUKREJA - 2023UCM2318 - @USERNAME

SRIJAN MAHAJAN - 2023UCM2326 - @USERNAME

KARTIK DUA - 2023UCM2340 - @USERNAME

NAVNITA SINGH - 2023UCM2342 - @USERNAME

SHAURYA GAUR - 2023UCM2343 - @USERNAME

## Project Links

SIH Presentation: [Final SIH Presentation](URL TO PPT UPLOADED TO GITHUB)

Video Demonstration: [Watch Video](UNLISTED YOUTUBE LINK)

Live Deployment: [View Deployment](DEPLOYED LINK IF ANY)

Source Code: [GitHub Repository](GITHUB LINK TO THE REPO)

Additional Resources: [Other Relevant Links](ANY OTHER RELEVANT LINKS)

## Deployment

### Docker Compose (local, both services)
- Ensure web/.env is populated with required variables.
- From the repo root, run:
  - docker compose up --build
- Web service: http://localhost:3000
- AI service: http://localhost:8000 (health: /ping)

### Render.com (Docker)
You can deploy services from this repo to Render using Docker:

- Web (Next.js) service:
  - Root Dockerfile is provided and builds the app from ./web using Next.js standalone output.
  - On Render, create a new Web Service and select this repository.
  - Runtime: Docker
  - Dockerfile path: Dockerfile (at repo root)
  - Exposes port 3000 by default; Render will detect it via the Dockerfile EXPOSE instruction.
  - Set environment variables in Render as needed (corresponding to web/.env entries).

- AI (FastAPI) service:
  - Uses ai/Dockerfile.
  - On Render, create another Web Service (or Background Worker if appropriate) for the AI API.
  - Runtime: Docker
  - Dockerfile path: ai/Dockerfile
  - Port: 8000
  - Health check path: /ping

Note: Render does not use docker-compose; deploy the web and ai services as two separate services if you need both in production. If you only need the frontend, the root Dockerfile is sufficient to deploy the web app alone.



