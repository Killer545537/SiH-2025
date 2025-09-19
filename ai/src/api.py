from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List

# Create a new router instance
router = APIRouter()

# It will be returned for any resume upload.
GARBAGE_INTERNSHIPS = [
    {
        "internship_id": "INT-001",
        "title": "Software Development Intern",
        "company": "Tech Solutions Inc.",
        "location": "Remote",
        "description": "Work on exciting new features for our flagship product."
    },
    {
        "internship_id": "INT-002",
        "title": "Data Science Intern",
        "company": "Data Insights Co.",
        "location": "Bangalore, India",
        "description": "Analyze large datasets to extract meaningful insights and build predictive models."
    },
    {
        "internship_id": "INT-003",
        "title": "Marketing Intern",
        "company": "Growth Hackers",
        "location": "Hyderabas, India",
        "description": "Assist the marketing team with social media campaigns and content creation."
    }
]

@router.post("/upload-resume/", tags=["Internships"])
async def upload_resume_and_get_recommendations(file: UploadFile = File(...)):
    """
    Accepts a resume PDF, simulates scanning, and returns the most suitable list of internships.

    - **file**: The resume file to be uploaded (must be a PDF).
    """
    # --- 1. Validate File Type ---
    # In a real application, you'd do more robust validation.
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    # --- 2. Simulate Processing ---
    # In the future, this is where you would call your resume parser,
    # feature extractor, and recommendation model.
    # For now, we just print a message to the console.
    print(f"Received and 'processed' resume: {file.filename}")

    # --- 3. Return Data ---
    return {"filename": file.filename, "recommendations": GARBAGE_INTERNSHIPS}
