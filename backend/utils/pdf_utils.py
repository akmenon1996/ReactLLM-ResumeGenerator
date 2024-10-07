import PyPDF2

def extract_text_from_pdf(pdf_file):
    reader = PyPDF2.PdfReader(pdf_file)  # Use PdfReader instead of PdfFileReader
    text = ""
    for page in reader.pages:
        text += page.extract_text()  # Extract text from each page
    return text