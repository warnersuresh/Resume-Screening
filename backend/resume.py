import os
import fitz  # PyMuPDF
import uvicorn
import shutil
import nltk
from fastapi import FastAPI, UploadFile, File, Form
from pymongo import MongoClient
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download("punkt")

app = FastAPI()

UPLOAD_FOLDER = "resumes"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# MongoDB Connection
client = MongoClient('mongodb+srv://sathish2222k0150:utVYJHmoABWY4gpp@cluster0.olsvq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['user_auth_db']
resumes_collection = db['resumes']  # Collection to store resumes and ranks

# Sample job description (Modify as needed)
JOB_DESCRIPTION = """
Seeking a frontend developer with experience in React, JavaScript, HTML, CSS, and Tailwind. 
Knowledge of backend technologies like Node.js and databases such as MongoDB is a plus.
"""

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text += page.get_text()
    except Exception as e:
        print(f"Error extracting text: {e}")
    return text.strip()

# Function to calculate resume ranking
def calculate_resume_score(resume_text):
    if not resume_text:
        return 0  # If empty resume, score is 0

    documents = [JOB_DESCRIPTION, resume_text]
    vectorizer = CountVectorizer().fit_transform(documents)
    vectors = vectorizer.toarray()
    
    # Cosine Similarity Calculation
    similarity_score = cosine_similarity([vectors[0]], [vectors[1]])[0][0]
    
    return round(similarity_score * 100, 2)  # Convert to percentage

@app.post("/upload/")
async def upload_resume(file: UploadFile = File(...), email: str = Form(...)):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        resume_text = extract_text_from_pdf(file_path)
        rank_score = calculate_resume_score(resume_text)

        # Store in MongoDB
        resumes_collection.update_one(
            {"email": email}, 
            {"$set": {"filename": file.filename, "rank": rank_score}}, 
            upsert=True
        )

        return {"filename": file.filename, "email": email, "rank": rank_score}
    
    except Exception as e:
        return {"error": str(e)}
@app.get("/resumes/")
async def get_all_resumes():
    resumes = list(resumes_collection.find({}, {"_id": 0, "email": 1, "filename": 1, "rank": 1}))
    return resumes

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
