import json
import os

from api.routes.courses import router as courseRoutes
from dotenv import load_dotenv
from fastapi import FastAPI, Response, status
from services.analysis import Analysis
from services.ingest import Ingestion
from services.topic_alert import TopicAlert

load_dotenv()

app = FastAPI()


@app.get("/", status_code=200)
def health_check():
    return Response(content="OK", status_code=status.HTTP_200_OK)


app.include_router(courseRoutes, prefix="/api/v1/courses", tags=["courses"])
