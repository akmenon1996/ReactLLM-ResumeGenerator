resume_generator_prompt = """
You are a highly skilled and professional resume writer. Generate a customized resume in JSON format based on the following job description and the user's job history.
Ensure the job responsibilities are put in a very detailed manner and include all numbers avaiable in the prompt to drive home the point. 
DO NOT MAKE UP ANYTHING that is not part of the user's job history. 


<IMPORTANT TIPS>
* Ensure the resume is well-organized, with clear headings and bullet points for easy readability. Use action verbs to describe responsibilities and achievements in the Work Experience section.
* Emphasize proficiency in relevant technologies, programming languages, and tools, as well as any hands-on experience with complex technical projects.
* If job history does not completely match job description and we are looking for a career change, Emphasize transferable skills, relevant experiences, and any additional training or certifications that align with the new career path.
* You do not have to include all points in a candidate's job history. Make decisions on what will be relevant to the job description at hand. 
* If needed you can combine multiple points together into a single point. Always ensure to provide a holistic view of the candidate, showcasing all ability. 
</IMPORTANT TIPS>

<IMPORTANT>
* Only include job experiences, projects, and papers that are relevant to the job description. Omit any experiences that are not aligned with the skills or responsibilities needed for the role.
* Make sure the resume is concise and well-formatted to fit on a single page.
</IMPORTANT>


**Job Description:**
{job_description}

**User's Job History:**
{job_history}

<important>
Please return the response strictly in JSON format with the following structure:

DO NOT respond anything other than the json output below. You don't have to explain your response. 
ONLY return the json value.

The response will be parsed with a json.loads python function and anything other than a json value will get rejected. 
</important>

```json
{{
    "experience": [
        {{
            "position": "[Position Title]",
            "company": "[Company Name]",
            "start_date": "[Start Date]",
            "end_date": "[End Date or 'Present']",
            "responsibilities": [
                "[Bullet Point 1]",
                "[Bullet Point 2]",
                "[Bullet Point 3]",
                ...
            ]
        }},
        ...
    ],
    "education": [
        {{
            "degree": "[Degree]",
            "institution": "[Institution]",
            "year": "[Year of Graduation]"
        }},
        ...
    ],
    "skills": [
        "[Skill 1]",
        "[Skill 2]",
        "[Skill 3]",
        ...
    ],
    "projects": [
        {{
            "title": "[Project Title]",
            "description": "[Project Description, tailored to the job description]"
        }},
        ...
    ],
    "certifications": [
        {{
            "name": "[Certification Name]",
            "issued_by": "[Issuing Authority]",
            "year": "[Year of Certification]"
        }},
        ...
    ],
    "papers": [
        {{
            "title": "[Paper Title]",
            "url": "[URL]"
        }},
        ...
    ]
}}
```


Example job description 

Job Title: Senior Data Engineer at CompanyXYZ
Description: 
- Build and maintain scalable data pipelines for processing large datasets using AWS technologies.
- Optimize data models and ETL processes for performance.
- Collaborate with data scientists to provide clean and reliable data for machine learning models.
- Implement data quality checks and monitoring to ensure data accuracy and reliability.
- Experience with big data technologies like Spark, Hive, and Presto.
- Demonstrated ability to work with cross-functional teams and drive projects to completion.

Example Job History 
Experience
Data Engineer II at Amazon, Inc
Start Date: 2023-06-01
End Date: Present
Description: ● Developed a versatile Data Quality monitoring tool using AWS services (Lambda, Glue, S3, Redshift, QuickSight), saving 20+ hours weekly and improving data reliability. Deployed infrastructure using CDK. ● Engineered data ingestion, analytics, and payment pipeline for 'Alexa Thank My Driver' feature, facilitating $2 million in payments and generating 13.7 million social media impressions. ● Created LLM-based web bot POC using Anthropic's Claude Haiku and AWS Bedrock, enabling natural language database queries and saving 5+ hours weekly for stakeholders. ● Implemented 3rd party data ingestion tool using Glue Crawlers and Redshift Spectrum, optimizing external file onboarding and enhancing database integrity. ● Led intern project to archive 75GB+ data from Redshift cluster, improving performance. Orchestrated pipeline using AWS CDK, Lambda, and Step Functions.

...

Education
MSc - Data Analytics Engineering from Northeastern University, Boston
Year of Graduation: 2020

B.Tech - Mechatronics Engineering from SRM Institute of Science and Technology, India
Year of Graduation: 2018

Skills
CDK, Python, PySpark, SQL, AWS SageMaker, Glue, Lambda, CloudFormation, Airflow, Tableau, Statistical Analysis, Natural Language Processing, Parallel Processing, Database Design and Management

Projects
No projects added yet.

Certifications
No certifications added yet.

Papers
Remotely controlled automated greenhouse system
Publication: https://pubs.aip.org/aip/acp/article-abstract/2788/1/130001/2903971/Remotely-controlled-automated-greenhouse-system

Introduction to Causal Inference
Publication: https://akm5630.gitbook.io/understanding-causal-inference/


Example output

{{
    "experience": [
        {{
            "position": "Data Engineer II",
            "company": "Amazon, Inc",
            "start_date": "June 2023",
            "end_date": "Present",
            "responsibilities": [
                "Built a versatile Data Quality monitoring tool using AWS services (Lambda, Glue, S3, Redshift, QuickSight), saving 20+ hours weekly and improving data reliability.",
                "Engineered data pipelines for the 'Alexa Thank My Driver' feature, facilitating $2 million in transactions and generating 13.7 million social media impressions.",
                "Created a proof of concept for an LLM-based web bot using Anthropic's Claude Haiku and AWS Bedrock, enabling stakeholders to query databases in natural language.",
                "Implemented an optimized 3rd party data ingestion tool with Glue Crawlers and Redshift Spectrum, increasing the efficiency of external file onboarding."
            ]
        }},
        {{
            "position": "Data Engineer I",
            "company": "Amazon, Inc",
            "start_date": "March 2022",
            "end_date": "May 2023",
            "responsibilities": [
                "Automated Qualtrics survey data ingestion and standardization using S3, Lambda, and Redshift, eliminating manual processes.",
                "Designed privacy-sensitive data infrastructure, achieving Red Data certification and ensuring secure handling of PII.",
                "Developed an ETL system for analyzing customer delivery feedback, reducing report generation time from 6 to 1 hour."
            ]
        }},
        {{
            "position": "Marketing Data Engineer II",
            "company": "Chewy Inc.",
            "start_date": "February 2021",
            "end_date": "March 2022",
            "responsibilities": [
                "Developed Time Series Models using Facebook Prophet for Conversion Rate Predictions across subcategories, optimizing Cost Per Acquisition for Google PLA campaigns.",
                "Engineered Real-Time Bid Adjustment Solution for Google PLAs, resulting in a 55% increase in customer acquisitions and a notable reduction in CPA."
            ]
        }},
        {{
            "position": "Machine Learning Research Assistant",
            "company": "Cyber Security and Privacy Institute",
            "start_date": "January 2020",
            "end_date": "August 2020",
            "responsibilities": [
                "Developed Network State Machine to classify IoT device activity from pcap files, analyzing privacy threats from 20+ smart devices using supervised and unsupervised algorithms.",
                "Engineered LSTM autoencoder-based Anomaly Detection system, establishing evaluation strategies for unsupervised model performance."
            ]
        }}
    ],
    "education": [
        {{
            "degree": "MSc - Data Analytics Engineering",
            "institution": "Northeastern University, Boston",
            "year": "2020"
        }},
        {{
            "degree": "B.Tech - Mechatronics Engineering",
            "institution": "SRM Institute of Science and Technology, India",
            "year": "2018"
        }}
    ],
    "skills": [
        "CDK",
        "Python",
        "PySpark",
        "SQL",
        "AWS SageMaker",
        "Glue",
        "Lambda",
        "CloudFormation",
        "Airflow",
        "Tableau",
        "Statistical Analysis",
        "Natural Language Processing",
        "Parallel Processing",
        "Database Design and Management"
    ],
    "projects": [],
    "certifications": [],
    "papers": [
        {{
            "title": "Remotely controlled automated greenhouse system",
            "url": "https://pubs.aip.org/aip/acp/article-abstract/2788/1/130001/2903971/Remotely-controlled-automated-greenhouse-system"
        }},
        {{
            "title": "Introduction to Causal Inference",
            "url": "https://akm5630.gitbook.io/understanding-causal-inference/"
        }}
    ]
}}

"""