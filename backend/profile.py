from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import shutil
import os
import jwt
from datetime import datetime, timedelta
from bson import ObjectId
from fastapi.encoders import jsonable_encoder

app = FastAPI()

# Secret key for JWT
SECRET_KEY = "274d3e83086f8b70e09ca7d469d8d2d63d9514e7f28c258790945dc104aec58d"
ALGORITHM = "HS256"

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend to access backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = AsyncIOMotorClient("mongodb+srv://sathish2222k0150:utVYJHmoABWY4gpp@cluster0.olsvq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["user_auth_db"]
users_collection = db["users"]

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# User Profile Model
class UserProfile(BaseModel):
    email: str
    phone: str = ""
    address: str = ""
    city: str = ""
    zip: str = ""
    dob: str = ""
    employeeId: str = ""
    hireDate: str = ""
    jobRole: str = ""
    imageUrl: str = ""
    resumeUrl: str = ""

# Function to create JWT token
def create_jwt_token(email: str):
    return jwt.encode({"email": email, "exp": datetime.utcnow() + timedelta(hours=12)}, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["email"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/login")
async def login(email: str):
    return {"token": create_jwt_token(email)}

@app.put("/profile")
async def update_profile(
    current_user: str = Depends(get_current_user),
    phone: str = Form(""), address: str = Form(""), city: str = Form(""),
    zip: str = Form(""), dob: str = Form(""), employeeId: str = Form(""),
    hireDate: str = Form(""), jobRole: str = Form(""),
    image: UploadFile = File(None), resume: UploadFile = File(None)
):
    # Fetch existing user
    existing_user = await users_collection.find_one({"email": current_user})

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found. Please register first.")

    # Prepare update data
    update_data = {}
    if phone: update_data["phone"] = phone
    if address: update_data["address"] = address
    if city: update_data["city"] = city
    if zip: update_data["zip"] = zip
    if dob: update_data["dob"] = dob
    if employeeId: update_data["employeeId"] = employeeId
    if hireDate: update_data["hireDate"] = hireDate
    if jobRole: update_data["jobRole"] = jobRole

    # Handle image upload
    if image:
        image_filename = f"{datetime.utcnow().timestamp()}_{image.filename}"
        with open(os.path.join(UPLOAD_DIR, image_filename), "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        update_data["imageUrl"] = image_filename

    # Handle resume upload
    if resume:
        resume_filename = f"{datetime.utcnow().timestamp()}_{resume.filename}"
        with open(os.path.join(UPLOAD_DIR, resume_filename), "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)
        update_data["resumeUrl"] = resume_filename

    # Update user profile in MongoDB
    await users_collection.update_one({"email": current_user}, {"$set": update_data})

    # Fetch updated user data and convert ObjectId to string
    updated_user = await users_collection.find_one({"email": current_user})
    if updated_user:
        updated_user["_id"] = str(updated_user["_id"])  # Convert ObjectId to string

    return {"message": "Profile updated successfully", "user": jsonable_encoder(updated_user)}
@app.get("/profile")
async def get_profile(current_user: str = Depends(get_current_user)):
    user = await users_collection.find_one({"email": current_user})
    if not user:
        return {"message": "User not found", "user": None}  # Return None for new users
    
    user["_id"] = str(user["_id"])  # Convert ObjectId to string
    return {"message": "Profile fetched successfully", "user": jsonable_encoder(user)}

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
