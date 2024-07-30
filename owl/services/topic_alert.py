import os

import hdbscan
import numpy as np
import psycopg2
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_mistralai import MistralAIEmbeddings
from langchain_openai import ChatOpenAI
from pinecone import Pinecone
from sklearn import metrics
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler

load_dotenv()

connection_string = os.getenv('DATABASE_URL')
# Connect to the Postgres database
conn = psycopg2.connect(connection_string)
# Create a cursor object
cur = conn.cursor()


pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
INDEX_NAME = "prompts"


class TopicAlert:
    def __init__(self, course_id: str):
        self.course_id = course_id

    def get_prompts(self):
        print("Getting Prompts")

        cur.execute('SELECT * from prompts where course_id = \'' +
                    self.course_id + '\';')

        prompts = cur.fetchall()
        print("Finished Getting Prompts")
        return prompts

    def create_documents(self, prompts):
        print("Creating Embeddings")
        documents = []
        for prompt in prompts:
            parsedPrompt = "Question: " + prompt[2] + "\nAnswer: " + prompt[3]
            doc = Document(page_content=parsedPrompt, metadata={
                           "promptId": prompt[0], "topic": prompt[8], "studentId": prompt[5]})
            documents.append(doc)
        return documents

    def create_embeddings(self, documents):
        print("Creating embeddings...")

        # Step 1: Prepare the content and keep metadata associated
        content_with_metadata = [(doc.page_content, doc.metadata)
                                 for doc in documents]

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

    def analyze_prompts(self, embeddings_with_metadata):
        X = np.array([doc['embedding'] for doc in embeddings_with_metadata])

        # Scaling data helps with high-dimensional spaces
        data = StandardScaler().fit_transform(X)

        # Cluster data using HDBSCAN
        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=10, min_samples=2, cluster_selection_method='eom')
        cluster_labels = clusterer.fit_predict(data)

        # Analyze clusters
        unique_clusters = np.unique(cluster_labels)
        print(f'Number of clusters found: {len(
            unique_clusters) - (1 if -1 in unique_clusters else 0)}')  # -1 is for outliers

        # Optionally, calculate density of clusters if needed (number of points per cluster volume/area/etc.)
        # This example does not compute actual volume, as that is non-trivial in high dimensions and often not directly necessary.

        # Print the size of each cluster
        clusters_info = {}
        for cluster in unique_clusters:
            if cluster != -1:
                # Extracting points belonging to this cluster
                points_in_cluster = data[cluster_labels == cluster]
                # Calculate centroid of the cluster
                centroid = np.mean(points_in_cluster, axis=0)
                # Calculate average distance of points in the cluster from the centroid
                distances = np.sqrt(
                    np.sum((points_in_cluster - centroid) ** 2, axis=1))
                average_distance = np.mean(distances)
                # Define density as the inverse of average distance (for simplicity)
                density = (
                    1 / average_distance if average_distance != 0 else 0) * 100

                size = len(points_in_cluster)
                cluster_score = (size * 1.5) + density if density != 0 else 0
                clusters_info[cluster] = {
                    'size': size, 'density': density, 'score': cluster_score}

        sorted_clusters_info = sorted(
            clusters_info.items(), key=lambda x: x[1]['score'], reverse=True)

        for idx, (cluster, info) in enumerate(sorted_clusters_info):
            sorted_clusters_info[idx] = {
                'cluster': int(str(cluster)), 'cluster_size': float(str(info['size'])), 'density': float(str(info['density'])), 'cluster_score': float(str(info['score'])), 'index': idx, 'num_clusters': len(sorted_clusters_info)-1
            }

        clusters_map = {item['cluster']: item for item in sorted_clusters_info}

        doc_map = {}
        for doc, label in zip(embeddings_with_metadata, cluster_labels):
            if label != -1:
                doc['metadata'].update(clusters_map[label])
                if label not in doc_map:
                    doc_map[label] = [doc]
                else:
                    doc_map[label].append(doc)
        return doc_map

    def analyze_cluster(self, docs):
        content = ""
        for doc in docs:
            content += doc['metadata']['text_content'] + "\n"

        chat = ChatOpenAI(model="gpt-4-turbo", temperature=0)

        messages = [
            SystemMessage(
                content='''
                            You are a labeler analyzing interactions between a student and a tutor. Identify the specific topic or concept the student is confused about based on the interaction. Respond only with the label that would complete the sentence: "It seems like students are confused about..." without including the rest of the sentence. The label must be less than 60 characters.
                        '''
            ),
            HumanMessage(content="{content}".format(
                content=content)),
        ]

        response = chat.invoke(messages)
        label = response.content

        insert_cluster = 'INSERT INTO clusters (course, density, label, score) VALUES (%s, %s, %s, %s) RETURNING id;'
        cur.execute(insert_cluster, (self.course_id,
                    docs[0]['metadata']['density'], label, docs[0]['metadata']['cluster_score']))

        conn.commit()

        new_cluster_id = cur.fetchone()[0]
        for doc in docs:
            insert_prompt = 'INSERT INTO prompt_clusters (cluster, prompt) VALUES (%s, %s);'
            cur.execute(insert_prompt, (new_cluster_id,
                        doc['metadata']['promptId']))
            conn.commit()

            doc.update({'cluster_id': new_cluster_id, 'label': label})

        return docs

    def analyze_clusters(self, doc_map):
        for doc in doc_map:
            print("Analyzing Cluster:", doc)
            docs = self.analyze_cluster(doc_map[doc])
            doc_map[doc] = docs

        docs = [item for sublist in doc_map.values() for item in sublist]

        return docs

    def store_content(self, embeddings):
        print("ingesting embeddings...")
        index = pc.Index(INDEX_NAME)

        # Prepare and upsert data into Pinecone
        upsert_data = []
        for idx, item in enumerate(embeddings):
            # Generate or use a unique identifier for each document
            vector_id = str(idx)
            # Convert embedding to list if it's not already
            vector = item['embedding']
            metadata = item['metadata']
            upsert_data.append((vector_id, vector, metadata))

        index.upsert(vectors=upsert_data, namespace=self.course_id)
        print("Finished Ingestion")
