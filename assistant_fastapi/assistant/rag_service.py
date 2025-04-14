from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain_ollama.llms import OllamaLLM
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from langchain_core.runnables.base import Runnable
from qdrant_client.models import Distance, VectorParams, Filter, FieldCondition, MatchValue, PayloadSchemaType
from langchain_core.documents import Document
import os

class Rag_Service:
    
    
    def __init__(self):
        model_name = os.getenv('EMBEDDING_MODEL_NAME')
        model_kwargs = {'device': 'cpu'}
        encode_kwargs = {'normalize_embeddings': True}
        qdrant_url = os.getenv("QDRANT_URL")
        collection_name = os.getenv('QDRANT_COLLECTION_NAME')

        client = QdrantClient(url=qdrant_url)
        embedding_model = HuggingFaceEmbeddings(
            model_name = model_name,
            model_kwargs = model_kwargs,
            encode_kwargs = encode_kwargs
        )

        if not client.collection_exists(collection_name):
            client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
            )
            client.create_payload_index(
                collection_name=collection_name,
                field_name="user_id",
                field_schema=PayloadSchemaType.INTEGER
            )
        vector_store = QdrantVectorStore.from_existing_collection(
                embedding=embedding_model,
                collection_name=collection_name,
                url=qdrant_url
            )

        model = OllamaLLM(model="deepseek-r1:7b")

        prompt = """
        1. Используй только контекст, приведенный ниже.
        2. Если сомневаешься в ответе, ответь "Я не знаю".
        3. Ответ давай ТОЛЬКО на русском языке

        Context: {context}

        Question: {input}

        Answer:
        """
        templated_prompt = ChatPromptTemplate.from_template(prompt)

        document_promt = ChatPromptTemplate.from_template(
            """
            context:
            content: {page_content}
            name: {name}
            """
            
        )
        combined_chain = create_stuff_documents_chain(
            llm=model,
            prompt=templated_prompt,
            document_prompt=document_promt
        )

        
        self._vector_store = vector_store
        self._embedding_model = embedding_model
        self._combined_chain = combined_chain
    
    
    def get_qa(self, user_id) -> Runnable:
        vectore_store = self._vector_store
        filters = Filter(
            must=[
                FieldCondition(
                    key='metadata.user_id',
                    match=MatchValue(value=user_id)
                )
            ]
        )
        retriever = vectore_store.as_retriever(
            search_kwargs={'filter': filters}
        )
        combined_chain = self._combined_chain
        qa = create_retrieval_chain(
                retriever=retriever,
                combine_docs_chain=combined_chain
            )
        return qa

    @property
    def vector_store(self) -> QdrantVectorStore:
        return self._vector_store

    async def process(self, query, user_id):
        qa = self.get_qa(user_id=user_id)
        answer = await qa.ainvoke({"input": query})
        return answer['answer']


    async def save_to_vector_storage(self, note: dict):

        doc = Document(
            page_content=note['text'],
            metadata={'name': note['name'], 
                    'user_id': note['user']}
        )
        vector_store = self._vector_store
        await vector_store.aadd_documents(
            documents=[doc],
            ids=[note['id']],
            batch_size = 1
        )
        
    async def delete_from_vector_storage(self, ids: list):
        vector_store = self._vector_store
        await vector_store.adelete(ids=ids)


rag_service = Rag_Service()