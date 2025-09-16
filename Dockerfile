# Root-level Dockerfile for platforms like Render.com
# This builds and runs the Next.js web app located in ./web as a standalone server

# ---------- Build Next.js Frontend ----------
FROM node:20-alpine AS web-builder
WORKDIR /web

# Copy package files first for better caching
COPY web/package.json web/pnpm-lock.yaml* web/yarn.lock* web/package-lock.json* web/.npmrc* ./

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Copy source code (excluding node_modules via .dockerignore)
COPY web/ .

# Build the application
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ---------- Build Python Backend ----------
FROM python:3.13-alpine AS ai-builder
WORKDIR /ai

# Install uv first
RUN pip install --upgrade pip && pip install uv

# Copy Python requirements
COPY ai/pyproject.toml ai/uv.lock* ./

# Install Python dependencies
RUN if [ -f uv.lock ]; then uv sync --frozen; else pip install .; fi

# Copy Python source code
COPY ai/ .

# Install the package
RUN pip install .

# ---------- Final Stage ----------
FROM node:20-alpine AS final
WORKDIR /app

# Install Python 3.13 and required system packages
RUN apk add --no-cache python3 py3-pip

# Copy Next.js build artifacts
COPY --from=web-builder /web/.next/standalone /web/
COPY --from=web-builder /web/.next/static /web/.next/static
COPY --from=web-builder /web/public /web/public

# Copy Python application and dependencies
COPY --from=ai-builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=ai-builder /ai /ai

# Add entrypoint script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose ports
EXPOSE 3000
EXPOSE 8000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV PYTHONPATH=/ai

# Entrypoint
CMD ["/bin/sh", "/start.sh"]
