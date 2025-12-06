# Создаем README файл
echo "# HP Life Tracker

Приложение для отслеживания активности и опыта.

## Установка
\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Запуск
\`\`\`bash
python -m app.main
\`\`\`" > README.md

git add README.md
git commit -m "Add README.md"
git push