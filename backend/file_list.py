import os
import time
import chardet

def get_file_encoding(file_path):
    """Detect file encoding to handle different encodings properly."""
    with open(file_path, 'rb') as f:
        raw_data = f.read()
    result = chardet.detect(raw_data)
    return result['encoding']

def read_file_content(file_path, encoding=None):
    """Reads the file content based on the detected encoding."""
    try:
        with open(file_path, 'r', encoding=encoding if encoding else 'utf-8') as file:
            return file.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

def save_codebase_info(base_dir, output_file):
    """Walks through the directory and saves file paths and contents to a .txt file."""
    with open(output_file, 'a', encoding='utf-8') as out_file:
        for root, dirs, files in os.walk(base_dir):
            for file_name in files:
                file_path = os.path.join(root, file_name)
                if file_path.contains('Venv'):
                    pass 
                else:
                    if file_name.endswith('.py') or file_name.endswith('.js') or file_name.endswith('.html') or file_name.endswith('.css'):  # Include file extensions as needed
                        try:
                            file_size = os.path.getsize(file_path)
                            last_modified = time.ctime(os.path.getmtime(file_path))
                            encoding = get_file_encoding(file_path)
                            content = read_file_content(file_path, encoding)

                            # Write file info and content to the output file
                            out_file.write(f"File Path: {file_path}\n")
                            out_file.write(f"File Size: {file_size} bytes\n")
                            out_file.write(f"Last Modified: {last_modified}\n")
                            out_file.write(f"Encoding: {encoding}\n")
                            out_file.write(f"Content:\n{content}\n")
                            out_file.write("-" * 80 + "\n\n")  # Separator between files
                        except Exception as e:
                            out_file.write(f"Error processing file {file_path}: {str(e)}\n")
                            out_file.write("-" * 80 + "\n\n")  # Separator for failed files

if __name__ == "__main__":
    base_directory = "/Users/abhijitkrishnamenon/code_packages/ReactResumeBuilder/llm-resume-generator/backend/services"  # Replace with the path to your codebase
    output_txt = "codebase_output.txt"  # Output file that will store all the information

    save_codebase_info(base_directory, output_txt)
    print(f"Codebase information has been saved to {output_txt}")

