resume_parser_prompt = """
Please extract the following information from the provided resume text and return it in the exact JSON format specified below. Ensure that every detail is captured as it is in the resume, without summarizing or condensing any points. 

Include all bullet points, descriptions, and details under each section.

- List of experiences, including:
  - "position": The job title or role.
  - "company": The name of the organization.
  - "start_date": The start date in YYYY-MM-DD format (or approximate month/year if exact date is not available).
  - "end_date": The end date in YYYY-MM-DD format (or "Present" if the role is ongoing).
  - "description": A detailed description of the responsibilities, achievements, and projects, including all bullet points and details as they appear in the resume.

- List of education, including:
  - "degree": The degree or certification obtained.
  - "institution": The name of the institution where the degree was obtained.
  - "year": The year of graduation or completion.

- List of skills.

- List of projects, including:
  - "title": The project title.
  - "description": A detailed description of the project, including all bullet points and details as they appear in the resume.

- List of certifications, including:
  - "name": The name of the certification.
  - "issued_by": The organization or institution that issued the certification.
  - "year": The year the certification was obtained.

- List of papers, including:
  - "title": The title of the paper.
  - "url": URL of the paper

Please respond with the information formatted as follows:

```json
{
  "experience": [
    {
      "position": "Software Engineer",
      "company": "Tech Company",
      "start_date": "2020-01-15",
      "end_date": "2022-06-30",
      "description": "Developed and maintained web applications. • Designed a scalable architecture for handling 100k+ users per day. • Led a team of 5 engineers to implement new features. • Improved application response time by 50%."
    },
    {
      "position": "Data Analyst",
      "company": "Data Corp",
      "start_date": "2018-05-01",
      "end_date": "2020-01-10",
      "description": "Analyzed data trends and created reports. • Built dashboards to visualize key metrics. • Automated data pipelines, reducing processing time by 30%. • Collaborated with cross-functional teams to deliver insights."
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science in Computer Science",
      "institution": "University of Example",
      "year": "2018"
    }
  ],
  "skills": [
    "Python", "Data Analysis", "Machine Learning", "SQL", "AWS"
  ],
  "projects": [
    {
      "title": "AI-Powered Resume Generator",
      "description": "Developed an AI-powered resume generator application using Streamlit and OpenAI GPT-4 API. • Implemented a robust profile management system with session state handling and database integration using SQLAlchemy."
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issued_by": "Amazon Web Services",
      "year": "2020"
    }
  ],
  "papers": [
    {
      "title": "Advanced Data Analysis Techniques",
      "publication": "Journal of Data Science",
      "year": "2021"
    }
  ]
}
"""