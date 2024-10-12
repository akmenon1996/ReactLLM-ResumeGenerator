from flask import Blueprint, request, jsonify, send_file
from flask_cors import cross_origin
from services.llm_service import generate_resume_via_llm
from services.pdf_service import create_resume_pdf
from models.user import UserProfile, URL
import tempfile
import os

resume_bp = Blueprint('resume_bp', __name__)

# Path to save generated files temporarily
OUTPUT_FOLDER = os.path.join(tempfile.gettempdir(), 'resumes')
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
allowed_origins = ["http://localhost:3000", "https://abmenon.pythonanywhere.com"]

@resume_bp.route('/api/generate-resume', methods=['POST','OPTIONS'])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def generate_resume():
    # Get the username from the query parameters or form data
    username = request.args.get('username')
    if not username:
        return jsonify({"message": "Username is required"}), 400

    # Get job description from the request
    job_description = request.json.get('jobDescription')
    fontSize = request.json.get('fontSize')
    lineHeight = request.json.get('lineHeight')
    if not job_description:
        return jsonify({"message": "Job description is required"}), 400

    # Fetch user profile (job history, education, skills) from the database
    user_profile = UserProfile.query.filter_by(username=username).first()
    if not user_profile:
        return jsonify({"message": "User profile not found"}), 404

    # Fetch URLs (LinkedIn, GitHub, etc.)
    urls = URL.query.filter_by(user_profile_id=user_profile.id).all()
    urls_json = [{"label": url.label, "url": url.url} for url in urls]

    # Prepare user job history for LLM
    job_history = {
        "experience": [exp.to_json() for exp in user_profile.experiences],
        "education": [edu.to_json() for edu in user_profile.education],
        "skills": [skill.to_json() for skill in user_profile.skills],
        "projects": [project.to_json() for project in user_profile.projects],
        "certifications": [cert.to_json() for cert in user_profile.certifications],
        "papers": [paper.to_json() for paper in user_profile.papers]
    }

    # Call the LLM service to generate resume based on job history and job description
    llm_response = generate_resume_via_llm(job_description, job_history)

    if not llm_response:
        return jsonify({"message": "Error generating resume via LLM"}), 500

    # Create a merged data object containing both the resume details from the LLM and user profile details
    merged_resume_data = {
        "name": user_profile.name,
        "email": user_profile.email,
        "phone": user_profile.phone,
        "urls": urls_json,
        "experience": llm_response.get('experience', []),
        "education": llm_response.get('education', []),
        "skills": llm_response.get('skills', []),
        "projects": llm_response.get('projects', []),
        "certifications": llm_response.get('certifications', []),
        "papers": llm_response.get('papers', [])
    }

    # Convert the LLM response (JSON) into a PDF resume
    pdf_file_path = os.path.join(OUTPUT_FOLDER, f'{username}_resume.pdf')
    create_resume_pdf(merged_resume_data,fontSize, lineHeight, pdf_file_path)  # Function to create PDF from JSON

    # Return the generated PDF to the frontend
    return send_file(pdf_file_path, as_attachment=True, download_name=f"{username}_resume.pdf")
