from openai import OpenAI
import os
import json
import re
# Load OpenAI API key from environment variables
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_profile_via_llm(resume_text):
    """
    This function sends the resume text to OpenAI's API with a specific prompt to get a structured JSON response.
    :param resume_text: The text extracted from the resume (or manually entered data).
    :return: A structured JSON response from the LLM (or None if there is an error).
    """
    # Import the resume_parser_prompt from the prompts folder
    from prompts.resume_parser import resume_parser_prompt  
    try:
        # Format the final prompt with the resume text
        prompt = f"{resume_parser_prompt}\n\nResume Text:\n{resume_text}"

        response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ]
            )

        # Extract the generated structured JSON response from the LLM
        llm_response_text = response.choices[0].message.content.strip()

        # Clean up and attempt to parse the response as JSON
        llm_response_cleaned = re.sub(r'^```json\s*|\s*```$', '', llm_response_text)
        structured_response = json.loads(llm_response_cleaned)
        print(structured_response)

        return structured_response

    except json.JSONDecodeError as json_error:
        print(f"Error parsing JSON from LLM response: {str(json_error)}")
        return None
    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
        return None


def generate_resume_via_llm(job_description, job_history):
    """
    This function sends the job description and user's job history to OpenAI's API with a specific prompt 
    to get a structured JSON response for resume generation.
    :param job_description: The job description provided by the user.
    :param job_history: The job history and other related details fetched from the database.
    :return: A structured JSON response from the LLM (or None if there is an error).
    """
    # Import the resume_generator_prompt from the prompts folder
    from prompts.resume_generator import resume_generator_prompt  # Ensure this prompt exists in your prompts folder
    
    try:
        # Format the final prompt with the job description and job history
        prompt = resume_generator_prompt.format(job_description=job_description, job_history=json.dumps(job_history, indent=2))

        response = client.chat.completions.create(
            model="gpt-4o-mini",  # Use the appropriate GPT model (adjust as necessary)
            messages=[
                {"role": "system", "content": "You are a professional resume generator."},
                {"role": "user", "content": prompt}
            ]
        )

        # Extract the generated structured JSON response from the LLM
        llm_response_text = response.choices[0].message.content.strip()

        # Clean up and attempt to parse the response as JSON
        llm_response_cleaned = re.sub(r'^```json\s*|\s*```$', '', llm_response_text)
        structured_response = json.loads(llm_response_cleaned)
        return structured_response

    except json.JSONDecodeError as json_error:
        print(f"Error parsing JSON from LLM response: {str(json_error)}")
        return None
    except Exception as e:
        print(f"Error calling OpenAI API: {str(e)}")
        return None
