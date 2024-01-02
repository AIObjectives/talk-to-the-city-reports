import os
import sys
import traceback
from mangum import Mangum
from pydantic import BaseModel
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "https://tttc-turbo.web.app",
    "http://localhost:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Exec(BaseModel):
    code: str

@app.post("/")
async def execute_code(code: Exec, request: Request):
    headers = request.headers
    
    auth_header = headers.get('Authorization')
    precomputed_hash = os.environ.get('SECRET')

    if auth_header != precomputed_hash:
        return {"message": "Invalid authorization"}

    if not code.code:
        return {"message": "No code provided"}
    
    exec_locals = {}
    try:
        exec(code.code, exec_locals, exec_locals)
    except Exception as e:
        error_traceback = traceback.format_exception(*sys.exc_info())
        return {"error": "An exception occurred", "traceback": error_traceback}
    
    output_data = exec_locals.get("outputData")
    return output_data

handler = Mangum(app)
