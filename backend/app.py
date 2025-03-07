from functools import wraps
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import jwt
from pymongo import MongoClient
import bcrypt
import os
from werkzeug.utils import secure_filename
import requests
from PyPDF2 import PdfReader
import datetime

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SECRET_KEY'] = '274d3e83086f8b70e09ca7d469d8d2d63d9514e7f28c258790945dc104aec58d'  # Change this to a strong secret key

client = MongoClient('mongodb+srv://sathish2222k0150:utVYJHmoABWY4gpp@cluster0.olsvq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['user_auth_db']
users_collection = db['users']

# Default Admin Credentials
DEFAULT_ADMIN = {
    "email": "admin@example.com",
    "password": bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
    "role": "Admin"
}

# Ensure admin exists in DB
if not users_collection.find_one({"email": DEFAULT_ADMIN["email"]}):
    users_collection.insert_one(DEFAULT_ADMIN)

# JWT Token Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')  # Fix here
        
        if not token or not token.startswith("Bearer "):
            return jsonify({'message': 'Token is missing or invalid!'}), 401
        
        try:
            token = token.split(" ")[1]  # Extract token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({"email": data['email']})
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

@app.route('/signup', methods=['POST'])
def signup():
    email = request.form.get('email')
    password = request.form.get('password')
    cv = request.files.get('cv')

    if users_collection.find_one({'email': email}):
        return jsonify({'message': 'Email already exists!'}), 400

    if not cv:
        return jsonify({'message': 'CV upload is required!'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    cv_filename = secure_filename(cv.filename)
    cv.save(os.path.join(app.config['UPLOAD_FOLDER'], cv_filename))

    users_collection.insert_one({
        'email': email,
        'password': hashed_password,
        'role': "User",
        'cv_filename': cv_filename
    })

    return jsonify({'message': 'Signup successful!'}), 200

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({'email': email})
    
    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):  # Fix here
        token = jwt.encode({
            'email': email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12)
        }, app.config['SECRET_KEY'], algorithm="HS256")

        return jsonify({
            'message': 'Login successful!',
            'token': token,
            'role': user.get('role', 'User')
        }), 200
    else:
        return jsonify({'message': 'Invalid email or password!'}), 400

@app.route('/get_uploads', methods=['GET'])
def get_uploads():
    users = users_collection.find({})
    uploads = []
    for user in users:
        uploads.append({
            'email': user['email'],
            'cv_filename': user.get('cv_filename', '')
        })
    return jsonify(uploads), 200

# Serve Uploaded Files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/get_jobs', methods=['GET'])
def get_jobs():
    url = 'https://api.adzuna.com/v1/api/jobs/in/search/1'
    params = {
        'app_id': 'bcc04bf2',
        'app_key': '935bcd518c90f0d9a089b77a85ca1e9b',
        'results_per_page': 40,
        'what': 'developer',
        'where': 'India'
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch jobs'}), 500

    jobs_data = response.json()
    jobs = []
    for job in jobs_data.get('results', []):
        jobs.append({
            'title': job.get('title', 'Unknown Title'),
            'company': job.get('company', {}).get('display_name', 'Unknown Company'),
            'location': job.get('location', {}).get('display_name', 'Unknown Location'),
            'url': job.get('redirect_url', '#')
        })

    return jsonify(jobs)

def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = ''.join([page.extract_text() or '' for page in reader.pages])
        return text if text.strip() else 'No extractable text found in PDF.'
    except Exception as e:
        return f'Error reading PDF: {str(e)}'

@app.route('/scan_pdf/<filename>', methods=['GET'])
@token_required
def scan_pdf(current_user, filename):
    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(pdf_path):
        return jsonify({'error': 'File not found'}), 404

    text = extract_text_from_pdf(pdf_path)
    return jsonify({'filename': filename, 'content': text})

@app.route('/delete_user/<email>', methods=['DELETE'])
def delete_user(email):
    user = users_collection.find_one({'email': email})

    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Delete the CV file if it exists
    cv_filename = user.get('cv_filename')
    if cv_filename:
        cv_path = os.path.join(app.config['UPLOAD_FOLDER'], cv_filename)
        if os.path.exists(cv_path):
            os.remove(cv_path)

    # Delete the user from MongoDB
    users_collection.delete_one({'email': email})

    return jsonify({'message': 'User deleted successfully'}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
