from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import traceback
from pathlib import Path
from app.routers import activities, rewards, timer, auth, xp, streak, recommendations, blacklist, telegram, admin, goals, categories

app = FastAPI(title="XP Tracker API")

# Обработка ошибок
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Глобальный обработчик ошибок"""
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "type": type(exc).__name__,
            "traceback": traceback.format_exc() if app.debug else None
        }
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Обработчик HTTP ошибок"""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

origins = ["*"]  # Разрешаем все origin для разработки
app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins, 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"],
    expose_headers=["*"]
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(activities.router)
app.include_router(rewards.router)
app.include_router(timer.router)
app.include_router(auth.router)
app.include_router(xp.router)
app.include_router(streak.router)
app.include_router(recommendations.router)
app.include_router(blacklist.router)
app.include_router(telegram.router)
app.include_router(admin.router)
app.include_router(goals.router)
app.include_router(categories.router)

@app.get("/")
async def root():
    """Главная страница - возвращаем HTML интерфейс"""
    html_file = Path("static/index.html")
    if html_file.exists():
        return FileResponse(html_file)
    return {"message": "XP Tracker API работает!", "frontend": "/static/index.html"}
