# LLM-Powered Resume Builder

This project is a full-stack application that allows users to create, update, and manage their profiles by uploading resumes in PDF format or manually entering data. The backend is powered by Flask, and the front end is built with React. The project leverages Large Language Models (LLM) to analyze and parse the uploaded resumes, and store the user profiles in a database.

## Features

- **User Registration and Authentication**: Users can register and log in to manage their profiles.
- **Profile Management**: Users can create and update their profiles, including adding experiences, education, skills, projects, certifications, papers, and external links (e.g., LinkedIn, GitHub).
- **Resume Upload**: Users can upload a resume in PDF format or paste their resume text for analysis.
- **LLM-Powered Resume Parsing**: The application uses an LLM to extract detailed information from uploaded resumes and populate user profiles.
- **Profile Wipe**: Users can choose to wipe their existing profile data without deleting their account.
- **URL Handling**: Users can add and update URLs for their external profiles (LinkedIn, GitHub, etc.).

## Technologies Used

- **Frontend**:
  - React
  - Material UI
  - Axios

- **Backend**:
  - Flask
  - Flask-CORS
  - Flask-SQLAlchemy
  - SQLAlchemy ORM
  - WerkZeug (for file uploads)
  
- **Database**:
  - SQLite (can be easily swapped with any relational database)

- **Services**:
  - LLM (for resume parsing and profile generation)
  - PDF Handling (to extract text from PDFs)
  
## Project Structure
\```plaintext
├── backend
│   ├── models
│   │   ├── user.py               # SQLAlchemy models for UserProfile and related models (Experience, Education, etc.)
│   ├── routes
│   │   ├── user_routes.py         # Flask routes for user-related operations (register, login, update profile, etc.)
│   ├── services
│   │   ├── auth_service.py        # Service to handle user authentication (register, login)
│   │   ├── user_service.py        # Service to handle profile processing (update profile, wipe profile)
│   │   ├── llm_service.py         # Service to interact with the LLM for resume parsing
│   │   ├── pdf_service.py         # Service to extract text from PDF resumes
│   ├── db.py                      # SQLAlchemy database configuration
│   ├── app.py                     # Flask application setup and initialization
│   └── README.md                  # Project documentation
│
└── frontend
    ├── src
    │   ├── components
    │   │   ├── UpdateProfile.js   # React component for updating the user's profile
    │   │   ├── CurrentProfile.js  # React component for displaying the current profile
    ├── README.md                  # Project documentation
    └── package.json               # Frontend dependencies
\```




## Installation

### Backend Setup

1. Clone the repository:
```bash
   git clone https://github.com/your-username/llm-resume-builder.git
   cd llm-resume-builder/backend
```

python3 -m venv ResumegeneratorVenv
source ResumegeneratorVenv/bin/activate  # On Windows use: ResumegeneratorVenv\Scripts\activate

2. Set up a Python virtual environment:

```bash
python3 -m venv ResumegeneratorVenv
source ResumegeneratorVenv/bin/activate  
# On Windows use: ResumegeneratorVenv\Scripts\activate
```
3. Install Dependencies 

```bash
pip install -r requirements.txt
```

4. Initialize SQLLite DB

```bash
flask db init
flask db migrate
flask db upgrade
```

5. Run Flash development server

```bash
flask run
```

## Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
Install dependencies:
```

```bash
npm install
Start the React development server:
```

```bash
npm start
```


Open your browser and go to http://localhost:3000.


## API Endpoints

### User Management

- POST /api/register
 Registers a new user.

- POST /api/login
Authenticates a user and returns a session.

### Profile Management

- GET /api/profile?username={username}
Retrieves the user profile by username.

- POST /api/profile
Updates the user profile based on form data (resume PDF or pasted text).

- POST /api/profile/wipe?username={username}
Wipes the user profile but keeps the account.

### Environment Variables
FLASK_ENV: Set to development during development.
DATABASE_URL: Set the database URL (optional if using SQLite).
OPENAI_API_KEY: Set openAI credentials


Contributing
Contributions are welcome! Please submit a pull request or open an issue for any bugs or feature requests.

