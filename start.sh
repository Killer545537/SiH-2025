#!/bin/sh
# Start Python backend
python3 -m uvicorn ai.src.main:app --host 0.0.0.0 --port 8000 &
# Start Next.js frontend
cd /web && node server.js

