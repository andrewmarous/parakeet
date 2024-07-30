
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


class GenerateCrossword():

    def __init__(self, course_id: str, topics):
        self.course_id = course_id
        self.topics = topics

    def parse_schema(self):
        start_time = time.time()
        f = open('./utils/crossword_schema.json')
        schema_template = json.load(f)
        parsed_schema = json.dumps(schema_template)
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

        start_time = time.time()
        prompt = PromptTemplate(
            template='''
            Create a crossword consisting of challenging terms tailored for university-level students, covering the following topics: {topics}. The crossword should rely on the context provided to fill in the blanks and should be testing the terminology from the course.

            The output should strictly conform to the following structure: a JSON object containing an outline of a crossword puzzle. Do not include the JSON schema itself in the output, only the objects described by the schema.

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

        crossword = chain.invoke({"context": results, "topics": self.topics})

        return crossword
