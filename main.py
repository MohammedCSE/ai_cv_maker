import os
import json

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
from groq import Groq

from pdf_reader import extract_text_from_pdf


# Load .env
load_dotenv()

# Create FastAPI app
app = FastAPI()


# Allow our HTML/JavaScript frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Get Groq API key
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


@app.post("/analyze")
async def analyze_cv(file: UploadFile = File(...)):

    if file.content_type != "application/pdf":
        return {
            "error": "Please upload a PDF file."
        }

    file_path = f"uploaded_{file.filename}"

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    text = extract_text_from_pdf(file_path)

    if not text.strip():
        return {
            "error": "Could not extract text from this PDF."
        }

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "system",
                "content": """
You are an expert CV and resume analyser.

Analyse the CV and return ONLY valid JSON.

Give scores from 0 to 100 for:

- profile
- skills
- experience
- projects
- education
- formatting

Also calculate an overall_score.

Give exactly 3 specific improvements.

Return this exact structure:

{
    "overall_score": 0,
    "sections": {
        "profile": 0,
        "skills": 0,
        "experience": 0,
        "projects": 0,
        "education": 0,
        "formatting": 0
    },
    "improvements": [
        "Improvement 1",
        "Improvement 2",
        "Improvement 3"
    ]
}
"""
            },
            {
                "role": "user",
                "content": f"Analyse this CV:\n\n{text}"
            }
        ],
        temperature=0.2
    )

    result = response.choices[0].message.content

    try:
        analysis = json.loads(result)
    except json.JSONDecodeError:
        return {
            "error": "AI returned an invalid response.",
            "raw_response": result
        }

    analysis["original_text"] = text

    return analysis