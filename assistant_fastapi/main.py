from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
from .assistant.rag_service import rag_service
import httpx
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
        django_data = response.json()
        if response.status_code == 200:
            answer = await rag_service.process(data['query'], django_data['id'])
            return JSONResponse({"answer": answer}, status_code=200)


        elif response.status_code == 500:
           return JSONResponse({"error": "django server is not availible"}, status_code=500)
    except Exception as ex:
     return JSONResponse({"error": str(ex)}, status_code=500)


@app.post('/chat/savevector/')
async def save_vector(request: Request):
    try:
        data = await request.json()
        await rag_service.save_to_vector_storage(data['note'])
        return JSONResponse({"message": "vector saved"}, status_code=200)
    except Exception as ex:
     return JSONResponse({"error": str(ex)}, status_code=500)

@app.post('/chat/deletevector/')
async def delete_vector(request: Request):
    try:
        data = await request.json()
        await rag_service.delete_from_vector_storage(ids=[data['note_id']])
        return JSONResponse({"message": "vector deleted"}, status_code=200)
    except Exception as ex:
     return JSONResponse({"error": str(ex)}, status_code=500)