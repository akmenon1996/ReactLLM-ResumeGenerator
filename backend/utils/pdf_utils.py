import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io
import cv2
import numpy as np

def convert_pdf_to_images(pdf_path):
    """Converts each page of a PDF to images."""
    doc = fitz.open(pdf_path)
    images = []
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        pix = page.get_pixmap()
        img = Image.open(io.BytesIO(pix.tobytes()))
        images.append(img)
    return images

def preprocess_image(image):
    """Preprocesses the image by converting to grayscale and applying thresholding."""
    img = np.array(image)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply thresholding to get a binary image
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
    
    # Convert back to PIL Image
    preprocessed_img = Image.fromarray(thresh)
    
    return preprocessed_img

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF by converting pages to images, preprocessing, and running OCR."""
    images = convert_pdf_to_images(pdf_path)
    extracted_text = ""
    
    for img in images:
        # Preprocess the image
        preprocessed_img = preprocess_image(img)
        
        # Perform OCR
        text = pytesseract.image_to_string(preprocessed_img, lang='eng')
        extracted_text += text + "\n"
    
    return extracted_text