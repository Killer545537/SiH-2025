from fastapi import FastAPI
from .api import router as api_router
# Initialize the FastAPI application
app = FastAPI(
    title="Resume Intelligence API",
    description="A simple API to get internship recommendations from a resume.",
    version="0.1.0",
)

# Include the API router
# All routes defined in api.py will be available under the /api prefix
app.include_router(api_router, prefix="/api")

@app.get("/", tags=["Root"])
async def read_root():
    """
    A simple root endpoint to confirm the API is running.
    """
    return {"message": "Welcome to the Resume Intelligence API. Go to /docs to see the API documentation."}
