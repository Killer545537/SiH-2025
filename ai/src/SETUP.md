## AI Service Backend

This directory contains the FastAPI backend for the Resume Intelligence and Internship Recommender system.
How to Run

You can run this service locally for development or build it as a Docker container.
## 1. Running Locally (for Development)

Prerequisites: Python 3.11+

    Navigate to the ai directory:
    cd /path/to/your/project/ai

    Create a virtual environment (recommended):
    python -m venv venv
    source venv/bin/activate  # On Windows, use venv\Scripts\activate

    Install dependencies:
    pip install -r requirements.txt

    Run the FastAPI server:
    uvicorn src.main:app --reload

    The --reload flag automatically restarts the server when you make code changes.

## 2. Running with Docker

Prerequisites: Docker installed and running.

    Navigate to the ai directory:
    cd /path/to/your/project/ai

    Build the Docker image:
    docker build -t resume-recommender-ai .

    Run the Docker container:
    docker run -p 8000:80 resume-recommender-ai

    This command maps port 8000 on your local machine to port 80 inside the container.

## How to Test with Swagger UI

Once the server is running (either locally or in Docker), you can test the API using the automatically generated documentation.

    Open your web browser and go to:

        http://127.0.0.1:8000/docs (if running locally)

        http://localhost:8000/docs (if running with Docker)

    You will see the Swagger UI interface.

    Expand the POST /api/upload-resume/ endpoint.

    Click "Try it out".

    Click "Choose File" and select any PDF file from your computer.

    Click "Execute".

You should receive a 200 OK response containing the name of your uploaded file and the list of internship recommendations.