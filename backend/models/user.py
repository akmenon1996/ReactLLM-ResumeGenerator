from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from db import db 

# Extra Websites
class URL(db.Model):
    __tablename__ = 'urls'

    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(100), nullable=False)  # Label for the URL (e.g., LinkedIn, GitHub)
    url = db.Column(db.String(200), nullable=False)  # The actual URL
    user_profile_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'), nullable=False)

    def to_json(self):
        return {
            'label': self.label,
            'url': self.url
        }

# User Profile model
class UserProfile(db.Model):
    __tablename__ = 'user_profiles'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)  # For authentication only
    name = db.Column(db.String(120), nullable=True)  # User metadata
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)  # Optional phone number
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Relationships to other models
    experiences = db.relationship('Experience', backref='user_profile', lazy=True)
    education = db.relationship('Education', backref='user_profile', lazy=True)
    skills = db.relationship('Skill', backref='user_profile', lazy=True)
    projects = db.relationship('Project', backref='user_profile', lazy=True)
    certifications = db.relationship('Certification', backref='user_profile', lazy=True)
    papers = db.relationship('Paper', backref='user_profile', lazy=True)
    urls = db.relationship('URL', backref='user_profile', lazy=True)  # New relationship for URLs

    def to_json(self):
        return {
            'username': self.username,
            'name': self.name,  # Include user metadata
            'email': self.email,
            'phone': self.phone,
            'experiences': [exp.to_json() for exp in self.experiences],
            'education': [edu.to_json() for edu in self.education],
            'skills': [skill.to_json() for skill in self.skills],
            'projects': [project.to_json() for project in self.projects],
            'certifications': [cert.to_json() for cert in self.certifications],
            'papers': [paper.to_json() for paper in self.papers],
            'urls': [url.to_json() for url in self.urls],  
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    
    def to_resume_text(self):
        """
        Returns a textual representation of the user's profile, which can be sent to the LLM.
        """
        resume_text = []

        if self.name:
            resume_text.append(f"Name: {self.name}")
        if self.email:
            resume_text.append(f"Email: {self.email}")
        if self.phone:
            resume_text.append(f"Phone: {self.phone}")

        if self.experiences:
            resume_text.append("\nExperiences:")
            for exp in self.experiences:
                resume_text.append(f"- {exp.position} at {exp.company} ({exp.start_date} - {exp.end_date})\n  {exp.description}")

        if self.education:
            resume_text.append("\nEducation:")
            for edu in self.education:
                resume_text.append(f"- {edu.degree} from {edu.institution} ({edu.year})")

        if self.skills:
            resume_text.append("\nSkills:")
            resume_text.append(", ".join([skill.name for skill in self.skills]))

        if self.projects:
            resume_text.append("\nProjects:")
            for project in self.projects:
                resume_text.append(f"- {project.title}: {project.description}")

        if self.certifications:
            resume_text.append("\nCertifications:")
            for cert in self.certifications:
                resume_text.append(f"- {cert.name}, issued by {cert.issued_by} ({cert.year})")

        if self.papers:
            resume_text.append("\nPapers:")
            for paper in self.papers:
                resume_text.append(f"- {paper.title}: {paper.url}")

        if self.urls:
            resume_text.append("\nURLs:")
            for url in self.urls:
                resume_text.append(f"- {url.label}: {url.url}")

        return "\n".join(resume_text)



# Experience model (no changes required here)
class Experience(db.Model):
    __tablename__ = 'experiences'

    id = db.Column(db.Integer, primary_key=True)
    position = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.String(10))  # Use string to store date (YYYY-MM-DD)
    end_date = db.Column(db.String(10))  # Could also store 'Present'
    description = db.Column(db.Text, nullable=True)
    user_profile_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'), nullable=False)

    def to_json(self):
        return {
            'position': self.position,
            'company': self.company,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'description': self.description
        }

# Education model
class Education(db.Model):
    __tablename__ = 'education'

    id = db.Column(db.Integer, primary_key=True)
    degree = db.Column(db.String(100), nullable=False)
    institution = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(4))  # Year of graduation or completion
    user_profile_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'), nullable=False)

    def to_json(self):
        return {
            'degree': self.degree,
            'institution': self.institution,
            'year': self.year
        }

# Skill model
class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_profile_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'), nullable=False)

    def to_json(self):
        return {
            'name': self.name
        }

# Project model
class Project(db.Model):
    __tablename__ = 'projects'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    user_profile_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'), nullable=False)

    def to_json(self):
        return {
            'title': self.title,
            'description': self.description
        }

# Certification model
class Certification(db.Model):
    __tablename__ = 'certifications'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    issued_by = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(4))  # Year of certification
    user_profile_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'), nullable=False)

    def to_json(self):
        return {
            'name': self.name,
            'issued_by': self.issued_by,
            'year': self.year
        }

# Paper model
class Paper(db.Model):
    __tablename__ = 'papers'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    url = db.Column(db.String(200), nullable=True)
    user_profile_id = db.Column(db.Integer, db.ForeignKey('user_profiles.id'), nullable=False)

    def to_json(self):
        return {
            'title': self.title,
            'url': self.url
        }
