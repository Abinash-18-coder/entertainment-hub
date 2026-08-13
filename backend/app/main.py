from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Initialize the FastAPI application instance
app = FastAPI(
    title="Entertainment Hub API",
    description="Backend service for entertainment data",
    version="1.0.0"
)

# 2. List the allowed frontend web addresses (ports)
# Vite (React) runs on http://localhost:5173 by default
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# 3. Add CORS (Cross-Origin Resource Sharing) middleware
# Without this, web browsers will block React from requesting data from Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Define our first test endpoint (Root Route)
@app.get("/")
def read_root():
    return {"status": "online", "message": "Entertainment Hub API is running"}

# 5. Define a dedicated health check route for the frontend
@app.get("/api/v1/health")
def health_check():
    return {"status": "success", "data": "Backend-Frontend communication active"}