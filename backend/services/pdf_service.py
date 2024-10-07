from utils.pdf_utils import extract_text_from_pdf

def handle_pdf_upload(pdf_file):
    # Extract text from the uploaded PDF file
    pdf_text = extract_text_from_pdf(pdf_file)
    # Return the extracted text for further processing (by LLM)
    return pdf_text
