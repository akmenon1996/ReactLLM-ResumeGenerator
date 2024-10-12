# app.py

import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from routes.user_routes import user_bp
from routes.pdf_routes import pdf_bp
from routes.resume_routes import resume_bp
from db import db  # Import db from db.py
from config import Config  # Import configuration

app = Flask(__name__, static_folder='static', static_url_path='')

# Load the configuration from Config class
app.config.from_object(Config)

# Initialize the SQLAlchemy instance with the app
db.init_app(app)

# Enable CORS globally (adjust the origins as needed for production)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

# Register Blueprints for your API routes
app.register_blueprint(user_bp)
app.register_blueprint(pdf_bp)
app.register_blueprint(resume_bp)

# Serve React static files
@app.route('/')
@app.route('/<path:path>')
def serve_react_app(path=None):
    if path is None or path == "":
        return send_from_directory(app.static_folder, 'index.html')
    else:
        if os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

# Initialize the database in the application context
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
