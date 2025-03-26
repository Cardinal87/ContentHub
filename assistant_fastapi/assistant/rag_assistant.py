from langchain_experimental.text_splitter import SemanticChunker
from langchain_qdrant import QdrantVectorStore
from langchain_ollama.llms import OllamaLLM
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
import os
from dotenv import load_dotenv

load_dotenv()

def process(query, list_notes: dict):
    model_name = "intfloat/multilingual-e5-large-instruct"
    model_kwargs = {'device': 'cpu'}
    encode_kwargs = {'normalize_embeddings': True}

    embedding_model = HuggingFaceEmbeddings(
        model_name = model_name,
        model_kwargs = model_kwargs,
        encode_kwargs = encode_kwargs
    )
    text_splitter = SemanticChunker(embedding_model)
    documents = [Document(
        page_content=note['text'],
        metadata={'name': note['name']}
    ) for note in list_notes]

    splitted_documents = text_splitter.split_documents(documents)

    qdrant_url = os.getenv("QDRANT_URL")
    vector_store = QdrantVectorStore.from_documents(
        documents=splitted_documents, 
        embedding=embedding_model, 
        url=qdrant_url,
        prefer_grpc=True,
        collection_name="user_docs"
        )
    retriever = vector_store.as_retriever()

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

    qa = create_retrieval_chain(
        retriever=retriever,
        combine_docs_chain=combined_chain
    )
    answer = qa.invoke({"input": query})
    
    return answer['answer']