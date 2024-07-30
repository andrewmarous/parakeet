import json
import os
from collections import Counter

import openai
import psycopg2
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from psycopg2.extras import execute_batch

load_dotenv()

connection_string = os.getenv('DATABASE_URL')
# Connect to the Postgres database
conn = psycopg2.connect(connection_string)
# Create a cursor object
cur = conn.cursor()

openai.api_key = os.getenv("OPENAI_API_KEY")


class Analysis():

    def __init__(self, course_id: str):
        self.course_id = course_id

    def get_prompts(self, reclassify=False):
        print("Getting Prompts")
        reclassify_str = ";" if reclassify else " and analysis_complete = false;"

        cur.execute('SELECT * from prompts where course_id = \'' +
                    self.course_id + '\'' + reclassify_str)

        prompts = cur.fetchall()
        print("Finished Getting Prompts")
        return prompts

    def get_course(self):
        print("Getting Course")
        cur.execute('SELECT * from courses where id = \'' +
                    self.course_id + '\';')
        course = cur.fetchone()
        print("Finnished Getting Course")
        return course

    def analyze_prompt(self, prompt, topics):
        print("Analyzing Prompts")
        parsedPrompt = "Question: " + prompt[2] + "\nAnswer: " + prompt[3]
        chat = ChatOpenAI(model="gpt-4", temperature=0)
        messages = [
            SystemMessage(
                content="You are a categorization assistant. Your task is to categorize input strings based on a predefined list of categories. When given an input string, analyze its content and determine which single category it best fits into. Your response should be the name of the category only. Here are the rules: \
                1. If the input clearly fits into one of the categories, return that category. \
                2. If the input could fit into multiple categories, choose the one it correlates with the most. \
                3. Do not return multiple categories. \
                4. If the input is related to course logistics such as questions about Prelim, Midterm, Final, Exams, Projects, Assignments or anything else related to the logistics of the course, return \"Course Logistics\". \
                5. If the input does not fit into any of the categories, return \"Unknown\". \
                6. You are not allowed to respond with a category not listed in the categories. \
                Example: \
                If the input string is \"What animals live on farms?\" and the categories are [\"Farm animals\", \"Reptiles\", “Birds”], your response should be “Farm animals”."
            ),
            HumanMessage(content="Categorize the following input: {prompt}, given the following categories: {topics}. Do not respond with a category not listed in the categories.".format(
                prompt=parsedPrompt, topics=topics)),
        ]

        response = chat.invoke(messages)
        print("Finished Analyzing Prompts")
        return response.content.replace("\"", "").strip()

    def analyze_prompts(self, prompts, topics):
        print("Analyzing Prompts")
        content_counter = Counter()
        prompt_updates = []

        try:
            # Start a transaction explicitly
            cur.execute("BEGIN;")

            # Function to divide the prompts into chunks of 30
            for prompt in prompts:
                category = self.analyze_prompt(prompt, topics)
                category = category.replace(
                    "”", "").replace("“", "").strip()
                print(category)
                sources = json.loads(prompt[4])["sources"]
                for content in sources:
                    content_counter[content] += 1

                prompt_updates.append((True, category, prompt[0]))

                # Execute batch update for every 30 prompts
                update_query = """
                    UPDATE prompts
                    SET analysis_complete = %s, topic = %s
                    WHERE id = %s;
                    """
                execute_batch(cur, update_query, prompt_updates)
                prompt_updates = []  # Reset the list for the next batch

            # After all chunks have been processed, update the media content counts
            content_updates = []
            for content, count in content_counter.most_common():
                content_updates.append((count, content))

            update_query = """
                    UPDATE media
                    SET retrieved = retrieved + %s
                    WHERE id = %s;
                    """
            execute_batch(cur, update_query, content_updates)

            # Commit the transaction if all operations were successful
            conn.commit()
            print("Finished Analyzing All Prompts")

        except Exception as e:
            # Rollback the transaction in case of error
            conn.rollback()
            print(f"An error occurred: {e}")
