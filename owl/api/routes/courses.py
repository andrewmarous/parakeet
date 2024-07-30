import json
import os
from typing import List

import psycopg2
import requests
from dotenv import load_dotenv
from fastapi import APIRouter, File, UploadFile, WebSocket
from pinecone import Pinecone
from pydantic import BaseModel
from services.analysis import Analysis
from services.create_crossword import GenerateCrossword
from services.generate_exam import GenerateExam
from services.ingest import Ingestion
from services.retrieval import Retrieval
from services.topic_alert import TopicAlert

router = APIRouter()

load_dotenv()

connection_string = os.getenv('DATABASE_URL')
# Connect to the Postgres database
conn = psycopg2.connect(connection_string)
# Create a cursor object
cur = conn.cursor()


@router.post("/{course_id}/ingest")
async def ingest(course_id: str, files: List[UploadFile] = File(...)):
    try:
        # Create the temp directory if it doesn't exist
        directory_path = f"./{course_id}"
        if not os.path.exists(directory_path):
            os.makedirs(directory_path)

        # create temp folder with course content
        for file in files:
            contents = await file.read()
            # Do something with the file contents

            # Modify the save path to include the course_id directory
            file_path = os.path.join(directory_path, file.filename)

            with open(file_path, "wb") as f:
                f.write(contents)

        ingestionService = Ingestion(course_id)
        ingestionService.ingest()

        return {"status": "success"}
    except Exception as e:
        print(e)
        return {"error": str(e)}


class Query(BaseModel):
    question: str
    previous_context: List[dict]


@router.post("/{course_id}/prompt")
async def prompt(course_id: str, query: Query):
    try:
        # prompt course
        retrievalService = Retrieval(course_id, query.question)
        candidates = retrievalService.rerank_retrieve()
        response, sources = retrievalService.prompt(
            candidates, previous_context=query.previous_context)

        return {"response": response, "sources": sources}
    except Exception as e:
        return {"error": str(e)}


class ReingestBody(BaseModel):
    files: List[str]


@router.post("/{course_id}/reingest")
async def reingest(course_id: str, body: ReingestBody):
    files = body.files
    try:
        directory_path = f"./{course_id}"
        if not os.path.exists(directory_path):
            os.makedirs(directory_path)

        # create temp folder with course content
        for file_url in files:
            try:
                # Get the PDF content
                response = requests.get(file_url)
                response.raise_for_status()  # Check if the download was successful

                # Extract the PDF file name from the URL
                filename = file_url.split('/')[-1]

                # Define the path to save the file
                file_path = os.path.join(directory_path, filename)

                # Save the PDF
                with open(file_path, 'wb') as f:
                    f.write(response.content)

                print(f"Downloaded and saved: {filename}")
            except requests.RequestException as e:
                print(f"Error downloading {file_url}: {e}")

        ingestionService = Ingestion(course_id, reingest=True)
        ingestionService.ingest()

        return {"status": "success"}
    except Exception as e:
        print(e)
        return {"error": str(e)}


@router.get("/{course_id}/analysis")
async def analysis(course_id: str, reclassify: bool):
    analyzer = Analysis(course_id)
    course = analyzer.get_course()
    prompts = analyzer.get_prompts(reclassify=reclassify)
    topics = course[6][1:-1].split(",")
    analyzer.analyze_prompts(prompts, topics)

    return {"status": "success"}


@router.get("/{course_id}/topic-alert")
async def analysis(course_id: str):
    topicAlert = TopicAlert(course_id)
    prompts = topicAlert.get_prompts()
    documents = topicAlert.create_documents(prompts)
    embeddings = topicAlert.create_embeddings(documents)
    doc_map = topicAlert.analyze_prompts(embeddings)
    docs = topicAlert.analyze_clusters(doc_map)
    topicAlert.store_content(docs)

    return {"status": "success"}


class CreateExam(BaseModel):
    topics: List[str]
    exam_name: str


@router.post("/{course_id}/create-exam")
async def analysis(course_id: str, body: CreateExam):
    topics = body.topics
    exam_name = body.exam_name

    generateExam = GenerateExam(course_id, topics, exam_name)
    exam = generateExam.generate_exam()

    return {"exam": exam}


class CreateCrossword(BaseModel):
    topics: List[str]


@router.post("/{course_id}/create-crossword")
async def analysis(course_id: str, body: CreateCrossword):
    topics = body.topics

    generateCrossword = GenerateCrossword(course_id, topics)
    crossword = generateCrossword.generate_exam()

    return {"crossword": crossword}


class DiscussionQuery(BaseModel):
    question: str
    previous_context: List[dict]
    discussion: str


@router.post("/{course_id}/discussion-prompt")
async def discussion_prompt(course_id: str, query: DiscussionQuery):
    try:
        # prompt course
        retrievalService = Retrieval(course_id, query.question)
        candidates = retrievalService.rerank_retrieve()
        response, sources = retrievalService.prompt(
            candidates, previous_context=query.previous_context)

        cur = conn.cursor()

        cur.execute('INSERT INTO replies (course, content, discussion, is_parakeet, markdown_content, poster_name, is_answer, date_posted) VALUES (%s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP);', (
            course_id, json.dumps(
                {}), query.discussion, True, response, "Parakeet", False
        ))
        conn.commit()

        cur.close()
        conn.close()
        return {"success": True}

    except Exception as e:
        print(e)
        return {"error": str(e)}
