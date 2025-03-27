
from langchain_core.documents import Document
from .rag_service import rag_service

async def process(query, user_id):
    
    qa = rag_service.get_qa(user_id=user_id)
    answer = await qa.ainvoke({"input": query})
    return answer['answer']


async def save_to_vector_storage(note: str):

    doc = Document(
        page_content=note['text'],
        metadata={'name': note['name'], 
                  'user_id': note['user']}
    )
    vector_store = rag_service.vector_store
    await vector_store.aadd_documents(
        documents=[doc],
        ids=[note['id']],
        batch_size = 1
    )
    
async def delete_from_vector_storage(ids: list):
    vector_store = rag_service.vector_store
    await vector_store.adelete(ids=ids)