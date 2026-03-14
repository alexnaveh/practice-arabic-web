from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Practice Arabic API is running 🚀"}