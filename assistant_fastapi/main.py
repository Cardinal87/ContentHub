from fastapi import FastAPI, Request, Body
from fastapi.responses import JSONResponse
import requests
import os
from dotenv import load_dotenv
from .assistant.rag_assistant import process
import httpx
from contextlib import asynccontextmanager
import json


async def lifespan(app):
    load_dotenv()
    url = os.getenv('DJANGO_CORE_URL')
    app.state.http_client = httpx.AsyncClient(base_url=url)

    yield

    await app.state.http_client.aclose()



app = FastAPI(lifespan=lifespan)
    



@app.get('/chat/getanswer/')
async def get_answer(request: Request):
    try:
        http_client: httpx.AsyncClient = request.app.state.http_client
        os.getenv('DJANGO_CORE_URL')
        cookies = request.cookies
        response = await http_client.get('api/check/', cookies = cookies)
        
        data = await request.json()
        if response.status_code == 200:
            notes_resp = await http_client.get('api/getnotes/', cookies = cookies)
            if notes_resp.status_code == 200:
               notes = notes_resp.json()
               answer = process(data['query'], notes)
               return JSONResponse({"answer": answer}, status_code=200)


        elif response.status_code == 500:
           return JSONResponse({"error": "django server is not availible"}, status_code=500)
    except Exception as ex:
     return JSONResponse({"error": str(ex)}, status_code=500)
