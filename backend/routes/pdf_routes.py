from flask import Blueprint, request, jsonify
from services.pdf_service import handle_pdf_upload
from flask_cors import cross_origin

pdf_bp = Blueprint('pdf', __name__)
allowed_origins = ["http://localhost:3000", "https://abmenon.pythonanywhere.com"]

@pdf_bp.route('/api/upload-pdf', methods=['POST'])
@cross_origin(origin=allowed_origins, supports_credentials=True)
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"message": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    # Process the PDF file and extract text
    pdf_text = handle_pdf_upload(file)
    return jsonify({"extracted_text": pdf_text}), 200
