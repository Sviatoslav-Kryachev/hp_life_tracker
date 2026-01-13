#!/usr/bin/env python3
"""
Скрипт для запуска сервера из правильной директории
"""
import os
import sys
from pathlib import Path

# Убеждаемся, что мы в правильной директории
script_dir = Path(__file__).resolve().parent
project_root = script_dir.parent

# Меняем рабочую директорию на корень проекта
os.chdir(project_root)

# Добавляем Backend в путь для импорта
sys.path.insert(0, str(script_dir))

# Запускаем сервер
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
