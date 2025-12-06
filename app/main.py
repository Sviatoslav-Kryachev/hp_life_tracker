from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import activities, rewards, timer, auth, xp  # ✅ + xp

app = FastAPI(title="XP Tracker API")

origins = ["http://localhost", "http://127.0.0.1:8000"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(activities.router)
app.include_router(rewards.router)
app.include_router(timer.router)
app.include_router(auth.router)
app.include_router(xp.router)  # ✅ ДОБАВЬ ЭТО

@app.get("/")
def root():
    return {"message": "XP Tracker API работает!"}
