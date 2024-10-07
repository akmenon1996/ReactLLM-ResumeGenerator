# resume_generator_service.py

from models.user import UserProfile, URL
from pdf_service import create_resume_pdf
import os

def generate_resume(username, resume_json):
    try:
        # Fetch user profile from the database
        user_profile = UserProfile.query.filter_by(username=username).first()
        if not user_profile:
            return {"message": "User not found"}, 404

        # Fetch URLs (LinkedIn, GitHub, etc.) from the database
        urls = URL.query.filter_by(user_profile_id=user_profile.id).all()
        urls_json = [{"label": url.label, "url": url.url} for url in urls]

        # Create a merged data object containing both the resume details from the LLM and user profile details
        merged_resume_data = {
            "name": user_profile.name,
            "email": user_profile.email,
            "phone": user_profile.phone,
            "urls": urls_json,
            "experience": resume_json.get('experience', []),
            "education": resume_json.get('education', []),
            "skills": resume_json.get('skills', []),
            "projects": resume_json.get('projects', []),
            "certifications": resume_json.get('certifications', []),
            "papers": resume_json.get('papers', [])
        }

        print(merged_resume_data)

        # Define output path for the PDF
        output_path = os.path.join("/path/to/save", f"{username}_resume.pdf")

        # Call function to create the resume PDF
        create_resume_pdf(merged_resume_data, output_path)

        return {"message": "Resume generated successfully!", "pdf_path": output_path}, 200

    except Exception as e:
        print(f"Error generating resume: {e}")
        return {"message": "Error generating resume"}, 500
