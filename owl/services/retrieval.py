import os

import openai
from dotenv import load_dotenv
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain.retrievers.contextual_compression import \
    ContextualCompressionRetriever
from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain_cohere import CohereRerank
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_mistralai import MistralAIEmbeddings
from langchain_openai.chat_models.base import ChatOpenAI
from langchain_deepseek import ChatDeepSeek
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone
from pydantic import SecretStr
from tokenizers import Tokenizer

load_dotenv()

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
INDEX_NAME = "parakeet-embeddings"
index = pc.Index(INDEX_NAME)
openai.api_key = os.getenv("OPENAI_API_KEY")


class Retrieval():

    def __init__(self, course_id: str, query: str):
        self.course_id = course_id
        self.query = query

    def retrieve(self):
        embeddings = MistralAIEmbeddings(
            model="mistral-embed",
            mistral_api_key=SecretStr(os.getenv("MISTRAL")),
            tokenizer=Tokenizer.from_pretrained(
                'mistralai/Mixtral-8x7B-v0.1',
                auth_token=os.getenv('HUGGINGFACE_HUB_TOKEN'))
        )

        vectorStore = PineconeVectorStore(
            namespace=self.course_id, embedding=embeddings, index_name=INDEX_NAME, text_key="text_content")

        retriever = vectorStore.as_retriever(
            search_type="mmr",
            search_kwargs={"k": 75})

        docs = retriever.get_relevant_documents(
            self.query)

        return docs

    def rerank_retrieve(self):
        embeddings = MistralAIEmbeddings(
            model="mistral-embed",
            mistral_api_key=SecretStr(os.getenv("MISTRAL")),
            tokenizer=Tokenizer.from_pretrained(
                            'mistralai/Mixtral-8x7B-v0.1')
        )

        print(os.getenv('OPENAI_API_KEY'))

        vectorStore = PineconeVectorStore(
            namespace=self.course_id, embedding=embeddings, index_name=INDEX_NAME, text_key="text_content")

        retriever = vectorStore.as_retriever(search_type="similarity_score_threshold",
                                             search_kwargs={"score_threshold": 0.6})

        try:
            # llm = ChatDeepSeek(temperature=0, model_name='deepseek-chat')
            llm = ChatOpenAI(temperature=0)
            retriever_from_llm = MultiQueryRetriever.from_llm(
                retriever=retriever, llm=llm
            )
        except Exception as e:
            print(e)

        compressor = CohereRerank(model='rerank-english-v3.0')
        compression_retriever = ContextualCompressionRetriever(
            base_compressor=compressor, base_retriever=retriever_from_llm
        )
        try:
            compressed_docs = compression_retriever.invoke(self.query)
        except Exception as e:
            print(e)

        return compressed_docs

    def prompt(self, retrieved: list, previous_context: list):
        # chat = ChatDeepSeek(model_name="deepseek-chat", temperature=0)
        chat = ChatOpenAI(temperature=0)
        # chat = Cohere(temperature=0)

        # Enhanced question-answering prompt with instructions for markdown formatting
        question_answering_prompt = ChatPromptTemplate.from_messages([
            ("system",
             "Question: {user_question}\n\n"
             "Instruction: Provide an answer to the student's question using only the specified course materials. If the content necessary to answer the question isn't available within these materials, do not answer the question and instead reply with: 'Sorry, but I could not find any course content related to your query. Please try another question.'\n\n"
             "Formatting Requirements: Respond in markdown format. Include any necessary LaTeX equations within single $...$ for inline and double $$...$$ for block formatting. Avoid HTML entities like &amp; and ensure that the text is compatible with LaTeX environments such as KaTeX.\n\n"
             "Context for Answering: Utilize the provided course content to formulate your response. Reference previous interactions if relevant to provide a more contextual answer.\n\n{context}\n\n"
             "Previous Conversations: {messages}"),
            MessagesPlaceholder(variable_name="messages"),
        ])

        # Assuming create_stuff_documents_chain is a function that prepares the document chain for the chat
        document_chain = create_stuff_documents_chain(
            chat, question_answering_prompt)

        # Ephemeral chat history setup
        demo_ephemeral_chat_history = ChatMessageHistory()
        for message in previous_context:
            demo_ephemeral_chat_history.add_user_message(message["prompt"])
            demo_ephemeral_chat_history.add_ai_message(message["response"])

        demo_ephemeral_chat_history.add_user_message(self.query)

        try:
            # Invoke the document chain with enriched context and specific question
            response = document_chain.invoke(
                {
                    "messages": demo_ephemeral_chat_history.messages,
                    "user_question": self.query,
                    "context": retrieved,
                }
            )
        except Exception as e:
            print(e)

        return response, retrieved

    def prompt_backup(self, retrieved: list, previous_context: list):
        chat = ChatOpenAI(model="gpt-4", temperature=0)

        question_answering_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Answer the user's questions based on the below context:\n\n{context}",
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        document_chain = create_stuff_documents_chain(
            chat, question_answering_prompt)

        demo_ephemeral_chat_history = ChatMessageHistory()
        for message in previous_context:
            demo_ephemeral_chat_history.add_user_message(message["prompt"])
            demo_ephemeral_chat_history.add_ai_message(message["response"])

        demo_ephemeral_chat_history.add_user_message(self.query)

        response = document_chain.invoke(
            {
                "messages": demo_ephemeral_chat_history.messages,
                "context": retrieved,
            }
        )

        return response, retrieved
