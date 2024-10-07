# app.py

from flask import Flask
from flask_cors import CORS
from routes.user_routes import user_bp
from routes.pdf_routes import pdf_bp
from routes.resume_routes import resume_bp
from db import db  # Import db from db.py
from config import Config  # Import configuration

app = Flask(__name__)
app.config.from_object(Config)

# Initialize the SQLAlchemy instance with the app
db.init_app(app)

# Enable CORS globally
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

# Register Blueprints
app.register_blueprint(user_bp)
app.register_blueprint(pdf_bp)
app.register_blueprint(resume_bp)

# Initialize the database in the application context
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
