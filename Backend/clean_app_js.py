#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Скрипт для очистки app.js от дубликатов функций, которые уже перенесены в модули
"""

import re

def clean_app_js():
    file_path = '../Frontend/static/js/app.js'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    original_count = len(lines)
    print(f"Исходный размер: {original_count} строк")
    
    # Находим все секции с комментариями "Функции перенесены"
    # и удаляем код между ними и следующей секцией
    new_lines = []
    i = 0
    skip_until_next_section = False
    
    while i < len(lines):
        line = lines[i]
        
        # Проверяем, является ли это комментарием "Функции перенесены"
        if '// Функции перенесены в app_' in line:
            # Добавляем этот комментарий и предыдущую строку с заголовком секции
            if i > 0 and '// =============' in lines[i-1]:
                new_lines.append(lines[i-1])  # Заголовок секции
            new_lines.append(line)  # Комментарий о переносе
            new_lines.append('\n')  # Пустая строка после комментария
            
            # Пропускаем все до следующей секции
            skip_until_next_section = True
            i += 1
            continue
        
        # Если мы пропускаем код, ищем следующую секцию
        if skip_until_next_section:
            # Проверяем, является ли это началом новой секции
            if line.strip().startswith('// =============') and '=============' in line:
                # Это новая секция, прекращаем пропуск
                skip_until_next_section = False
                # Продолжаем обработку этой строки
                continue
            else:
                # Пропускаем эту строку
                i += 1
                continue
        
        # Обычная строка - добавляем её
        new_lines.append(line)
        i += 1
    
    new_count = len(new_lines)
    print(f"Новый размер: {new_count} строк")
    print(f"Удалено: {original_count - new_count} строк")
    
    # Сохраняем результат
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("Готово! Файл очищен от дубликатов.")

if __name__ == '__main__':
    clean_app_js()
