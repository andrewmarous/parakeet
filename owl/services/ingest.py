import itertools
import os
import shutil
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import (CSVLoader, DirectoryLoader,
                                                  Docx2txtLoader, JSONLoader,
                                                  PyPDFLoader, TextLoader,
                                                  UnstructuredExcelLoader,
                                                  UnstructuredHTMLLoader,
                                                  UnstructuredMarkdownLoader,
                                                  UnstructuredPowerPointLoader)
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_experimental.text_splitter import SemanticChunker
from langchain_mistralai import MistralAIEmbeddings
from langchain_openai import ChatOpenAI
from langchain_openai.embeddings import OpenAIEmbeddings
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
INDEX_NAME = "parakeet-embeddings"


file_type_mappings = {
    '*.txt': TextLoader,
    '*.pdf': PyPDFLoader,
    '*.csv': CSVLoader,
    '*.docx': Docx2txtLoader,
    '*.xlss': UnstructuredExcelLoader,
    '*.xlsx': UnstructuredExcelLoader,
    '*.html': UnstructuredHTMLLoader,
    '*.pptx': UnstructuredPowerPointLoader,
    '*.ppt': UnstructuredPowerPointLoader,
    '*.md': UnstructuredMarkdownLoader,
    '*.json': JSONLoader,
}


class Ingestion():

    def __init__(self, course_id, reingest=False):
        self.course_id = course_id
        self.reingest = reingest

    def load_content(self):
        doc_counter = 0
        print("Loading the uploaded documents...")
        document_list = os.listdir(self.course_id)

        docs = []
        for doc_name in document_list:
            docs.extend(PyPDFLoader(os.path.join(
                self.course_id, doc_name)).load())
            doc_counter += 1

        print("Number of loaded documents:", doc_counter)
        print("Number of pages:", len(docs))
        print("-" * 100)

        # print(docs)

        return docs

    def split_content(self, content):
        print("Chunking documents...")

        # Initialize the text splitter outside the parallel block to avoid reinitialization
        text_splitter = SemanticChunker(MistralAIEmbeddings(
            model="mistral-embed",
            mistral_api_key=os.getenv("MISTRAL"),
        ))

        chunks = text_splitter.split_documents(content)

        # TODO: Make faster
        # llm = ChatOpenAI(temperature=0)
        # i = 0
        # for chunk in chunks:
        #     print(f"Processing chunk {i}/{len(chunks)}")
        #     message_content = f'''Objective: The following text is misformatted and lacks coherence in its current form. Your task is to rewrite it into coherent sentences.
        #                             It is crucial that you do not change the original words or phrases. Only fill in missing pieces that are absolutely necessary for the text to make sense or fix any apparent formatting issues. Do not introduce new ideas or significantly alter the meaning of the text.
        #                             Original Text: {chunk.page_content}
        #                             Please rewrite the text following the above instructions.'''

        #     messages = [
        #         SystemMessage(
        #             content=message_content
        #         ),
        #     ]

        #     # Invoke the LLM with the prepared message
        #     response = llm.invoke(messages)
        #     # Process the response here (e.g., print it or store it for further use)
        #     chunk.page_content = str(response.content)
        #     i += 1

        print("Number of chunks:", len(chunks))
        print("-" * 100)
        return chunks

    def embed_content(self, content):
        print("Creating embeddings...")

        # Step 1: Prepare the content and keep metadata associated
        content_with_metadata = [(doc.page_content, doc.metadata)
                                 for doc in content]

        # Extract just the text content for embedding
        text_contents = [doc[0] for doc in content_with_metadata]

        mistral = MistralAIEmbeddings(
            model="mistral-embed",
            mistral_api_key=os.getenv("MISTRAL"),
        )
        # Step 2: Embed the documents
        embeddings = mistral.embed_documents(text_contents)

        print("Finished embeddings...")

        # Step 3: Associate each embedding with its corresponding metadata
        embeddings_with_metadata = [{"embedding": embedding, "metadata": {**meta, "text_content": text_content}}
                                    for embedding, (text_content, meta) in zip(embeddings, content_with_metadata)]

        print("Number of embeddings:", len(embeddings_with_metadata))
        print("-" * 100)
        return embeddings_with_metadata

    def _chunks(self, iterable, batch_size=100):
        """A helper function to break an iterable into chunks of size batch_size."""
        it = iter(iterable)
        chunk = tuple(itertools.islice(it, batch_size))
        while chunk:
            yield chunk
            chunk = tuple(itertools.islice(it, batch_size))

    def store_content(self, embeddings_with_metadata):
        # Create or connect to an existing Pinecone index
        namespace = self.course_id
        index = pc.Index(INDEX_NAME)

        if self.reingest:
            namespaces = index.describe_index_stats()["namespaces"]
            if self.course_id in namespaces:
                index.delete(delete_all=True, namespace=self.course_id)

        # Prepare and upsert data into Pinecone
        upsert_data = []
        for idx, item in enumerate(embeddings_with_metadata):
            # Generate or use a unique identifier for each document
            vector_id = str(idx)
            # Convert embedding to list if it's not already
            vector = item['embedding']
            metadata = item['metadata']
            upsert_data.append((vector_id, vector, metadata))

        # Upsert batch of documents with embeddings and metadata
        new_chunks = self._chunks(upsert_data)
        for chunk in new_chunks:
            index.upsert(vectors=chunk, namespace=namespace)

        print("Clean up.")
        shutil.rmtree(self.course_id)

        print("Data upserted to Pinecone.")

    def ingest(self):
        content = self.load_content()
        chunks = self.split_content(content)
        embeddings = self.embed_content(chunks)
        self.store_content(embeddings)
