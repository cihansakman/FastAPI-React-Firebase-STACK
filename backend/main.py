#in order to run the FastApi -> uvicorn main:app --reload
#then we can go to /docs panel
from fastapi import FastAPI, HTTPException
# an HTTP-specific exception class  to generate exception information
from fastapi.middleware.cors import CORSMiddleware
#import neceserray functions for database
from database import (
    fetch_all_items_db,
    add_item,
    remove_item
)
app = FastAPI()
#Allow requests from port 3000 (React front-end)
origins = [
    "http://localhost:3000",
]
# what is a middleware? 
# software that acts as a bridge between an operating system or database and applications, especially on a network.
# ALLOW CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"Hello" : "World"}

@app.get("/api/item")
async def fetch_all_items():
    response = await fetch_all_items_db()
    if response:
        return response
    raise HTTPException(400, "Something went wrong")
# When we get a body from the front-end we need to specify the type of that incoming body element.
@app.post("/api/item")
async def add_items_to_db_by_query(request_body : dict):
    query = request_body['query']
    response = await add_item(query)
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

# Remove the item from the db
@app.delete("/api/item")
async def delete_item_from_db(request_body: dict):
    title = request_body['title']

    response = await remove_item(title)
    if response:
        return response
    raise HTTPException(404, f"There is no todo with the title {title}")
    
   