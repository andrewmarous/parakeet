
import json
import os
import time
from concurrent.futures import ThreadPoolExecutor

import openai
from dotenv import load_dotenv
from langchain import hub
from langchain.agents import AgentExecutor, create_json_chat_agent
from langchain.prompts import PromptTemplate
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.output_parsers import JsonOutputParser
from langchain_mistralai import MistralAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
INDEX_NAME = "parakeet-embeddings"
index = pc.Index(INDEX_NAME)
openai.api_key = os.getenv("OPENAI_API_KEY")


class GenerateExam():

    def __init__(self, course_id: str, topics, exam_name: str):
        self.course_id = course_id
        self.topics = topics
        self.exam_name = exam_name

    def parse_schema(self):
        start_time = time.time()
        f = open('./utils/exam_schema.json')
        schema_template = json.load(f)

        # Inserting the topics into the schema
        for question_type in schema_template["properties"]["questions"]["items"]["anyOf"]:
            if "topic" in question_type["properties"]:
                question_type["properties"]["topic"]["enum"] = self.topics

        parsed_schema = json.dumps(schema_template)
        end_time = time.time()
        print(f"Schema parsed in {end_time - start_time:.2f} seconds")
        # Convert the modified schema back to a JSON string
        return parsed_schema

    def retrieve_relevant_chunks(self, topic: str):
        start_time = time.time()
        embeddings = MistralAIEmbeddings(
            model="mistral-embed",
            mistral_api_key=os.getenv("MISTRAL"),
        )

        vectorStore = PineconeVectorStore(
            namespace=self.course_id, embedding=embeddings, index_name=INDEX_NAME, text_key="text_content")

        retriever = vectorStore.as_retriever(
            search_kwargs={"k": 10})

        docs = retriever.get_relevant_documents(
            topic)
        end_time = time.time()
        print(f"{topic} fetched in {end_time - start_time:.2f} seconds")
        return docs

    def generate_exam(self):

        schema = self.parse_schema()

        parser = JsonOutputParser()

        ragTime = time.time()
        with ThreadPoolExecutor() as executor:
            futures = [executor.submit(self.retrieve_relevant_chunks, topic)
                       for topic in self.topics]
            results = [future.result() for future in futures]
        ragEndTime = time.time()
        print(f"Rag Time: {ragEndTime - ragTime:.2f} seconds")

        start_time = time.time()
        prompt = PromptTemplate(
            template='''
            Create an exam consisting of challenging questions tailored for university-level students, covering the following topics: {topics}. The exam should rely on the context provided to answer the questions.

            The output should strictly conform to the following structure: a JSON object containing a list of questions, each question can be either multiple-choice or numerical based on the content's needs. Do not include the JSON schema itself in the output, only the objects described by the schema.

            For multiple-choice questions, provide:
            - A question stem,
            - Four options labeled with unique IDs,
            - The ID of the correct answer.
            - A markdown formatted explanation that relies on the provided context.

            Rules about numerical answers:
                - Only encorporate numerical answer formatting if the content dictates that an answer should be numerical. \\ 
               - If the content is not mathematical do not request a numeric response. For example if the content is about a reading passage, do not request a numerical answer.
            For numerical questions, present:
            - A problem requiring a calculation or derivation,
            - A numerical answer,
            - A markdown formatted explanation that relies on the provided context.

            Ensure each question tests a range of competencies from intermediate to advanced levels, covering theoretical understanding, application, critical thinking, and problem-solving skills.

            The questions should be diverse across the provided topics to challenge the breadth and depth of students' knowledge.
            
            Remember to ensure all fields required by the schema are correctly populated, including:
            - Question type,
            - Topic,
            - Question text,
            - Options (for multiple-choice),
            - Explanation: 
            - Correct answer.

            Context: {context}
            Topics: {topics}
            Format instructions: {format_instructions}
            ''',
            input_variables=["context", "topics"],
            partial_variables={"format_instructions": schema},
        )

        chain = prompt | ChatOpenAI(
            temperature=0, model="gpt-4-turbo") | parser
        # chain = prompt | ChatAnthropic(temperature=0, api_key=os.getenv(
        #     "ANTHROPIC_API_KEY"), model_name="claude-3-sonnet-20240229") | parser

        exam = chain.invoke({"context": results, "topics": self.topics})
        end_time = time.time()
        print(f"Prompted in {end_time - start_time:.2f} seconds")

        return exam
