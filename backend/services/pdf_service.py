from utils.pdf_utils import extract_text_from_pdf
from fpdf import FPDF
from jinja2 import Template
import pdfkit
import os
from datetime import datetime

# Define the HTML resume template
resume_template = """
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: {{ font_size }}px;
            color: #333;
            line-height: {{ line_height }};
        }
        h1 {
            font-size: 24px;
            text-align: center;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        h2 {
            font-size: 20px;
            border-bottom: 2px solid #333;
            margin-top: 10px;
            margin-bottom: 5px;
        }
        h3 {
            font-size: 18px;
            margin-top: 5px;
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
        }
        .date-right {
            margin-left: auto;
            text-align: right;
            font-size: 14px; /* Make dates smaller */
            color: #555; /* Slightly lighter color for dates */
        }
        p, ul {
            margin-bottom: 5px;
        }
        ul {
            list-style-type: disc;
            margin-left: 20px;
        }
        hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 15px 0;
        }
        .contact-info {
            width: 100%;
            display: table;
            margin-bottom: 10px;
        }
        .contact-info span {
            display: table-cell;
            margin: 0 15px;  
        }
        .contact-info a {
            color: #1a0dab;
            text-decoration: none;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>{{ name }}</h1>
    <div class="contact-info">
    <span>Email: {{ email }}</span>
    {% if phone %}
        <span>Phone: {{ phone }}</span>
    {% endif %}
    {% for url in urls %}
        <span><a href="{{ url['url'] }}">{{ url['label'] }}</a></span>
    {% endfor %}
</div>

    <!-- Experience Section -->
    <div class="experience">
        <h2>Experience</h2>
        {% for exp in experience %}
            <h3>
                <span>{{ exp['position'] }} at {{ exp['company'] }},  </span>
                <span class="date-right">{{ exp['start_date'] }} - {{ exp['end_date'] }}</span>
            </h3>
            <ul>
                {% for responsibility in exp['responsibilities'] %}
                    <li>{{ responsibility }}</li>
                {% endfor %}
            </ul>
        {% endfor %}
    </div>

    <!-- Education Section -->
    <div class="education">
        <h2>Education</h2>
        {% for edu in education %}
            <p>{{ edu['degree'] }}, {{ edu['institution'] }} ({{ edu['year'] }})</p>
        {% endfor %}
    </div>

    <!-- Skills Section -->
    <div class="skills">
        <h2>Skills</h2>
        <p>{{ ', '.join(skills) }}</p>
    </div>

    <!-- Projects Section (if available) -->
    {% if projects %}
    <div class="projects">
        <h2>Projects</h2>
        {% for project in projects %}
            <h3>{{ project['title'] }}</h3>
            <p>{{ project['description'] }}</p>
        {% endfor %}
    </div>
    {% endif %}

    <!-- Certifications Section (if available) -->
    {% if certifications %}
    <div class="certifications">
        <h2>Certifications</h2>
        {% for cert in certifications %}
            <p>{{ cert['name'] }}, Issued by {{ cert['issued_by'] }} ({{ cert['year'] }})</p>
        {% endfor %}
    </div>
    {% endif %}

    <!-- Papers Section (if available) -->
    {% if papers %}
    <div class="papers">
        <h2>Papers</h2>
        {% for paper in papers %}
            <p>{{ paper['title'] }} - <a href="{{ paper['url'] }}">{{ paper['url'] }}</a></p>
        {% endfor %}
    </div>
    {% endif %}
</body>
</html>
"""


# Function to format the date into a short form (e.g., "Mar 23")
def format_date(date_string):
    try:
        date_obj = datetime.strptime(date_string, '%Y-%m-%d')
        return date_obj.strftime('%b %y')  # Format as "Mar 23"
    except (ValueError, TypeError):
        return date_string 


def create_resume_pdf(merged_resume_data, fontSize, lineHeight, output_path):
    # Format the dates before passing into the template
    for exp in merged_resume_data.get('experience', []):
        exp['start_date'] = format_date(exp.get('start_date', ''))
        exp['end_date'] = format_date(exp.get('end_date', ''))

    # Render the HTML template with the resume data
    template = Template(resume_template)
    rendered_html = template.render(
        name=merged_resume_data.get('name', 'N/A'),
        email=merged_resume_data.get('email', 'N/A'),
        phone=merged_resume_data.get('phone', None),  # Use None if no phone number exists
        urls=merged_resume_data.get('urls', []),  # URLs are passed separately
        font_size=fontSize,  # Customize based on user input
        line_height=lineHeight,  # Customize based on user input
        experience=merged_resume_data.get('experience', []),  # Pass experience as a list
        education=merged_resume_data.get('education', []),  # Pass education as a list
        skills=merged_resume_data.get('skills', []),  # Pass skills as a list
        projects=merged_resume_data.get('projects', []),  # Pass projects as a list
        certifications=merged_resume_data.get('certifications', []),  # Pass certifications as a list
        papers=merged_resume_data.get('papers', [])  # Pass papers as a list
    )

    # Save the HTML to a file (optional for debugging)
    with open('resume.html', 'w') as f:
        f.write(rendered_html)

    # Convert the HTML to PDF using pdfkit
    pdfkit.from_string(rendered_html, output_path)

    print(f"Resume PDF saved to {output_path}")

def handle_pdf_upload(pdf_file):
    # Extract text from the uploaded PDF file
    pdf_text = extract_text_from_pdf(pdf_file)
    # Return the extracted text for further processing (by LLM)
    return pdf_text
