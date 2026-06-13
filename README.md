# 📅 Routine Week

Telegram Mini App для управления недельным планом: смены, тренировки, проект, задачи, стрик.

---

## Структура проекта

```
routine-week/
├── .env.example
├── README.md
├── bot/            # Telegram Bot (aiogram)
│   ├── requirements.txt
│   ├── config.py
│   ├── main.py
│   └── handlers/
│       └── start.py
├── backend/        # FastAPI + SQLite
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── db.py
│       ├── api/routes.py
│       ├── models/task.py
│       └── services/
│           ├── schedule.py
│           └── streak.py
└── frontend/       # React + TypeScript + Vite
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── styles.css
        ├── types/index.ts
        ├── hooks/usePlan.ts
        └── components/
            ├── Header.tsx
            ├── StreakPanel.tsx
            ├── WeekTimeline.tsx
            └── DayCard.tsx
```

---

## Быстрый старт

### 1. Переменные окружения

```bash
cp .env.example .env
# Вставь свой BOT_TOKEN от @BotFather
```

### 2. Запуск через Docker (как на сервере)

```bash
docker compose up --build
# → http://localhost:8000  (UI + API)
```

### 3. Или локально без Docker

**Backend:**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

**Bot:**

```bash
cd bot
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

> ⚠️ Для Telegram Mini App кнопка `web_app` требует **HTTPS** URL.
> Для локальной разработки используй [ngrok](https://ngrok.com/):
> ```bash
> ngrok http 8000
> ```
> Затем поставь https-адрес в `.env` → `MINI_APP_URL`.

---

## Деплой на сервер

Полная инструкция: **[DEPLOY.md](./DEPLOY.md)** — Fly.io, Render, переменные, BotFather.

Кратко:
1. `BOT_TOKEN` от @BotFather
2. Задеплой web (`Dockerfile` + `docker-compose.yml` / `fly.toml` / `render.yaml`)
3. Задеплой bot (`Dockerfile.bot`) — отдельный always-on процесс
4. `MINI_APP_URL` = HTTPS URL web-сервиса
5. BotFather → Edit Web App URL

---

## API

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/health` | Проверка сервера |
| GET | `/api/plan` | Недельный план с задачами |
| GET | `/api/stats` | Стрик и статистика |
| POST | `/api/tasks/toggle` | Переключить статус задачи |

### POST `/api/tasks/toggle`
```json
{ "task_id": 1 }
```

---

## Логика расписания

По умолчанию (настраивается в `backend/app/services/schedule.py`):

| День | Смена | Тренировка |
|------|-------|------------|
| Пн   | 13:00 | ✅ |
| Вт   | 10:00 | — |
| Ср   | —     | ✅ |
| Чт   | 9:00  | — |
| Пт   | 13:00 | ✅ |
| Сб   | 10:00 | — |
| Вс   | —     | — |

---

## Что дальше

- [ ] Напоминания в боте
- [ ] Вкладка "Проект" с таймером
- [ ] Режимы дня (утро / вечер)
- [ ] Привычки и трекер
- [ ] Календарь на месяц
- [ ] Push-уведомления
