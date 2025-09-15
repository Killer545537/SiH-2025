# Resume Intelligence & Internship Recommender

A lightweight, AI-assisted recommendation system for matching student resumes to the **most relevant internships**.  
The pipeline parses raw resumes into structured data, encodes skills/experience into embeddings, and ranks opportunities using **CatBoost** and **transformer-based semantic models**.  

This repository is structured as a small monorepo with two services:

- **parser**: Python service for resume parsing and feature extraction.  
- **recommender**: Python service for embedding, indexing, and ranking using CatBoost + FAISS.  
- **web** (optional demo): Streamlit app for interactive recommendations.  

---

## 📖 Table of Contents

- Overview  
- Stack and Components  
- Requirements  
- Setup and Run  
  - Run with Docker  
  - Run locally without Docker  
- Scripts  
- Environment Variables  
- Project Structure  
- License  
- TODOs  

---

## 📝 Overview

- **Resume Parsing:** Converts PDFs/DOCs into structured JSON (skills, education, projects, experience).  
- **Embeddings:** Sentence-Transformers (BGE/GTE) encode both resumes and internship postings into dense vectors.  
- **Indexing:** FAISS ANN index supports efficient top-k retrieval at scale.  
- **Ranking:** CatBoost uses structured + semantic features (skills overlap, embedding similarity, recency) to rank postings.  
- **Deployment:** Both services run via Docker Compose. A web demo is provided via Streamlit for quick testing.  

---

## ⚙️ Stack and Components

### Parser Service
- **Language:** Python 3.11  
- **Libraries:** spaCy, PyResparser, regex  
- **Purpose:** Extract candidate metadata into structured JSON.  

### Recommender Service
- **Language:** Python 3.11  
- **Embedding Models:** HuggingFace Transformers (BGE/GTE family for free + lightweight inference)  
- **Indexing:** FAISS (Approximate Nearest Neighbor)  
- **Ranking Model:** CatBoost (handles categorical + numerical features, avoids overfitting, scales well)  
- **Serving:** FastAPI + Uvicorn  
- 
---

## 📦 Requirements

- Docker + Docker Compose (recommended)  
- Alternatively for local dev:  
  - Python 3.11+  
  - pip/uv (dependency management)  

---
