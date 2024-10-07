from models.user import UserProfile, Experience, Education, Skill, Project, Certification, Paper
from db import db
from datetime import datetime

def process_profile(username, name, email, phone, llm_response):
    try:
        # Query for the existing user profile by username
        user_profile = UserProfile.query.filter_by(username=username).first()

        if not user_profile:
            # Create a new user profile if one doesn't exist
            user_profile = UserProfile(username=username, email=email, name=name, phone=phone)
            db.session.add(user_profile)
            db.session.commit()
        else:
            # Update the existing user profile's metadata
            user_profile.email = email
            user_profile.name = name
            user_profile.phone = phone
            db.session.commit()

        # Delete old experience, education, skills, projects, certifications, and papers
        Experience.query.filter_by(user_profile_id=user_profile.id).delete()
        Education.query.filter_by(user_profile_id=user_profile.id).delete()
        Skill.query.filter_by(user_profile_id=user_profile.id).delete()
        Project.query.filter_by(user_profile_id=user_profile.id).delete()
        Certification.query.filter_by(user_profile_id=user_profile.id).delete()
        Paper.query.filter_by(user_profile_id=user_profile.id).delete()

        # Add new experiences from the LLM response
        for exp in llm_response.get('experience', []):
            new_exp = Experience(
                position=exp.get('position'),
                company=exp.get('company'),
                start_date=exp.get('start_date'),
                end_date=exp.get('end_date'),
                description=exp.get('description'),
                user_profile_id=user_profile.id
            )
            db.session.add(new_exp)

        # Add new education from the LLM response
        for edu in llm_response.get('education', []):
            new_edu = Education(
                degree=edu.get('degree'),
                institution=edu.get('institution'),
                year=edu.get('year'),
                user_profile_id=user_profile.id
            )
            db.session.add(new_edu)

         # Add new education from the LLM response
        for project in llm_response.get('projects', []):
            new_project = Project(
                title=project.get('title'),
                description=project.get('description'),
                user_profile_id=user_profile.id
            )
            db.session.add(new_project)

        # Add new skills from the LLM response
        for skill in llm_response.get('skills', []):
            new_skill = Skill(name=skill, user_profile_id=user_profile.id)
            db.session.add(new_skill)

        # Add new certifications from the LLM response
        for cert in llm_response.get('certifications', []):
            new_cert = Certification(
                name=cert.get('name'),
                issued_by=cert.get('issued_by'),
                year=cert.get('year'),
                user_profile_id=user_profile.id
            )
            db.session.add(new_cert)

        # Add new papers from the LLM response
        for paper in llm_response.get('papers', []):
            new_paper = Paper(
                title=paper.get('title'),
                url=paper.get('url'),
                user_profile_id=user_profile.id
            )
            db.session.add(new_paper)

        # Commit all changes to the database
        db.session.commit()

        return {"message": "Profile updated successfully!"}, 200

    except Exception as e:
        print(f"Error processing profile: {e}")
        return {"message": "Error updating profile"}, 500


# Function to wipe user profile data (without deleting the user account)
def wipe_profile_data(username):
    try:
        # Query for the existing user profile by username
        user_profile = UserProfile.query.filter_by(username=username).first()

        if not user_profile:
            return {"message": "User not found"}, 404

        # Delete the user's profile data (experiences, education, skills, projects, certifications, papers)
        Experience.query.filter_by(user_profile_id=user_profile.id).delete()
        Education.query.filter_by(user_profile_id=user_profile.id).delete()
        Skill.query.filter_by(user_profile_id=user_profile.id).delete()
        Project.query.filter_by(user_profile_id=user_profile.id).delete()
        Certification.query.filter_by(user_profile_id=user_profile.id).delete()
        Paper.query.filter_by(user_profile_id=user_profile.id).delete()

        # Commit the deletion of the profile data
        db.session.commit()

        return {"message": "Profile data wiped successfully!"}, 200

    except Exception as e:
        print(f"Error wiping profile data: {e}")
        return {"message": "Error wiping profile data"}, 500
