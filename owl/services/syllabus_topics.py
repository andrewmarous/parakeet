import json
import os
import io
import PyPDF2
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
import falcon

# Load environment variables (including OPENAI_API_KEY)
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("Please set your OPENAI_API_KEY in your environment variables.")

class SyllabusAnalyzer:
    def __init__(self, syllabus_text: str):
        self.syllabus_text = syllabus_text

    def extract_metadata(self) -> str:
        """
        Uses an LLM to extract course metadata from the syllabus text.
        Expected metadata keys:
          - course_number
          - course_title
          - professor
          - year_semester
          - topics
        Returns the metadata as a JSON string.
        """
        prompt = (
            "You are an expert course metadata extractor. Extract the following information from the provided syllabus text:\n"
            "1. course number\n"
            "2. course title\n"
            "3. professor name\n"
            "4. year and semester of the course (if available)\n"
            "5. important topics covered in the course\n\n"
            "Output the results as a JSON string with the following keys: "
            "\"course_number\", \"course_title\", \"professor\", \"year_semester\", \"topics\".\n\n"
            "Syllabus text:\n"
            f"{self.syllabus_text}"
        )

        # Initialize ChatOpenAI using LangChain's interface
        chat = ChatOpenAI(model="gpt-4", temperature=0, openai_api_key=openai_api_key)
        messages = [
            SystemMessage(content="You extract course metadata from syllabus text."),
            HumanMessage(content=prompt)
        ]

        response = chat.invoke(messages)
        result_text = response.content.strip()

        # Attempt to parse and pretty-print the JSON response.
        try:
            result_json = json.loads(result_text)
            return json.dumps(result_json, indent=2)
        except json.JSONDecodeError:
            # If parsing fails, return the raw response.
            return result_text

class SyllabusResource:
    def on_post(self, req, resp):
        """
        Falcon endpoint to process the syllabus PDF.
        
        Steps:
        1. Falcon receives an API request from the frontend "Falcon" with a PDF file.
        2. The syllabus reader extracts text from the PDF.
        3. The SyllabusAnalyzer processes the text to extract course metadata.
        4. Owl returns a JSON containing course metadata to Falcon with HTTP 200 OK on success.
           If any step fails, an appropriate HTTP error code is returned along with cleanup.
        """
        try:
            # Get the uploaded file from the request (expects key "file")
            file_item = req.get_param('file')
            if file_item is None:
                resp.status = falcon.HTTP_400
                resp.media = {"error": "No file provided. Please upload a PDF file with key 'file'."}
                return

            # Read the PDF file into memory.
            pdf_bytes = file_item.file.read()
            pdf_stream = io.BytesIO(pdf_bytes)
            try:
                reader = PyPDF2.PdfReader(pdf_stream)
                syllabus_text = ""
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        syllabus_text += page_text + "\n"
                syllabus_text = syllabus_text.strip()
            finally:
                # Clean up the in-memory stream
                pdf_stream.close()

            # Check that text was successfully extracted.
            if not syllabus_text:
                resp.status = falcon.HTTP_400
                resp.media = {"error": "No text could be extracted from the provided PDF."}
                return

            # Process the syllabus text to extract course metadata.
            analyzer = SyllabusAnalyzer(syllabus_text)
            metadata_json = analyzer.extract_metadata()

            # Try to load the JSON response, fallback to raw text if necessary.
            try:
                metadata = json.loads(metadata_json)
            except json.JSONDecodeError:
                metadata = {"metadata": metadata_json}

            # Return the JSON result with HTTP 200 OK.
            resp.status = falcon.HTTP_200
            resp.media = metadata

        except Exception as e:
            # In case of failure, return HTTP 500 and clean up if necessary.
            resp.status = falcon.HTTP_500
            resp.media = {"error": f"An error occurred during processing: {e}"}
            # Additional cleanup actions could be placed here if required.

# Create the Falcon API and add the route.
app = falcon.App()
app.add_route('/analyze-syllabus', SyllabusResource())

