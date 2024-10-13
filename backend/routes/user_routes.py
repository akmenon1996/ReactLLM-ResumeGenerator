from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from services.auth_service import register_user, login_user
from services.user_service import process_profile, wipe_profile_data
from services.llm_service import generate_profile_via_llm
from services.pdf_service import handle_pdf_upload
from werkzeug.utils import secure_filename
from models.user import UserProfile,URL
import os
import tempfile
from db import db


user_bp = Blueprint('user_bp', __name__)

# Path to save uploaded files temporarily
UPLOAD_FOLDER = os.path.join(tempfile.gettempdir(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
allowed_origins = ["*"]

# Registration Route
@user_bp.route('/api/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    response, status_code = register_user(username, password, email)
    return jsonify(response), status_code

# Login Route
@user_bp.route('/api/login', methods=['POST', 'OPTIONS'])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    response, status_code = login_user(username, password)
    return jsonify(response), status_code

# Profile Update Route - Handle PDF or Text Input
@user_bp.route('/api/profile', methods=['POST'])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def update_profile():
    # Get the username from the query parameters
    username = request.args.get('username')
    if not username:
        return jsonify({"message": "Username is required"}), 400

    # Extract the email and name from the form data
    email = request.form.get('email')
    name = request.form.get('name')
    phone = request.form.get('phone')

    # Handling the resume PDF upload or direct text input
    resume_text = None
    if 'resume_pdf' in request.files:
        pdf_file = request.files['resume_pdf']
        filename = secure_filename(pdf_file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        pdf_file.save(file_path)
        resume_text = handle_pdf_upload(file_path)
        print(resume_text)
        if not resume_text:
            return jsonify({"message": "Error processing PDF"}), 500
    else:
        resume_text = request.form.get('resume_text')
        if not resume_text:
            return jsonify({"message": "No resume text provided"}), 400

    # Fetch the existing profile
    user_profile = UserProfile.query.filter_by(username=username).first()
    if not user_profile:
        return jsonify({"message": "User not found"}), 404

    # Parse the URLs from the form data
    print(request.form)
    urls = []
    index = 0

    while True:
        label = request.form.get(f"urls[{index}][label]")
        url = request.form.get(f"urls[{index}][url]")
        if not label or not url:
            break  # Stop if no more URLs are found
        urls.append({"label": label, "url": url})
        index += 1
    print(f"URLS --> {urls}")
    # Update URLs in the database
    URL.query.filter_by(user_profile_id=user_profile.id).delete()  # Clear existing URLs
    for url_data in urls:
        new_url = URL(label=url_data["label"], url=url_data["url"], user_profile_id=user_profile.id)
        db.session.add(new_url)

    # Process the resume using LLM if needed and update other fields
    combined_resume_text = f"Existing Profile:\n{user_profile.to_resume_text()}\n\nNew Submission:\n{resume_text}"
    llm_response = generate_profile_via_llm(combined_resume_text)

    if llm_response:
        # Call a function to update the rest of the profile (e.g., experience, skills, etc.)
        result = process_profile(username, name, email, phone, llm_response)
        db.session.commit()
        return jsonify(result), 200
    else:
        return jsonify({"message": "Error processing profile via LLM"}), 500

# Route to wipe the user profile but retain the user record
@user_bp.route('/api/profile/wipe', methods=['POST'])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def wipe_profile():
    username = request.args.get('username')
    user_profile = UserProfile.query.filter_by(username=username).first()
    if not username:
        return jsonify({"message": "Username is required"}), 400

    # Wipe the profile data for the user
    result, status_code = wipe_profile_data(username)
    URL.query.filter_by(user_profile_id=user_profile.id).delete()
    db.session.commit()
    return jsonify(result), status_code

# Get Profile Route
@user_bp.route('/api/profile', methods=['GET'])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def get_profile():
    username = request.args.get('username')
    if not username:
        return jsonify({"message": "Username is required"}), 400

    # Query the database for the user profile
    user_profile = UserProfile.query.filter_by(username=username).first()
    if user_profile:
        return jsonify(user_profile.to_json()), 200
    else:
        return jsonify({"message": "User not found"}), 404
