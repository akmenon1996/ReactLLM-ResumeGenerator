from models.user import UserProfile
from db import db
import hashlib
import os
import re  # For email validation

# Function to hash passwords using PBKDF2
def hash_password(password):
    salt = os.urandom(16)
    hashed_password = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt,
        100000
    )
    return salt.hex() + ':' + hashed_password.hex()

# Function to verify the password
def verify_password(stored_password, provided_password):
    salt, stored_hash = stored_password.split(':')
    hashed_password = hashlib.pbkdf2_hmac(
        'sha256',
        provided_password.encode('utf-8'),
        bytes.fromhex(salt),
        100000
    ).hex()
    return hashed_password == stored_hash

# Validate email format
def is_valid_email(email):
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(email_regex, email)

# User Registration
def register_user(username, password, email):
    if UserProfile.query.filter_by(username=username).first():
        return {"message": "Username already exists!"}, 400
    
    if not is_valid_email(email):
        return {"message": "Invalid email format!"}, 400

    try:
        hashed_password = hash_password(password)
        new_user = UserProfile(username=username, password=hashed_password, email=email)
        db.session.add(new_user)
        db.session.commit()
        return {"message": "User registered successfully!"}, 201
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return {"message": "Error occurred during registration: " + str(e)}, 500

# User Login
def login_user(username, password):
    user = UserProfile.query.filter_by(username=username).first()
    if user and verify_password(user.password, password):
        return {"message": "Login successful!", "username": user.username, "email": user.email}, 200
    return {"message": "Invalid username or password!"}, 401
