# Деплой Routine Week

Бот у тебя уже есть — нужно задеплоить **web** (Mini App + API) и **bot** (polling 24/7), затем прописать HTTPS URL в BotFather.

| Часть | Что делает |
|-------|------------|
| **Web** | React UI + FastAPI `/api/*` — один HTTPS URL |
| **Bot** | Кнопка «Open Routine Week» в Telegram |
| **БД** | SQLite в volume (`/data`) |

---

## Шаг 1. Git — один раз настроить имя

```powershell
git config --global user.email "твой@email.com"
git config --global user.name "Твоё Имя"
```

Потом в папке проекта:

```powershell
cd C:\Users\samsu\routine-week
git add .
git commit -m "Add deployment config for web and bot"
git push origin master
```

---

## Шаг 2. BotFather

1. `/token` → скопируй **BOT_TOKEN**
2. `/myapps` → если Mini App нет: `/newapp`
3. **Web App URL** — заполнишь после деплоя (шаг 4)

---

## Шаг 3. Деплой на Render (проще всего)

1. [render.com](https://render.com) → войти через GitHub
2. **New** → **Blueprint**
3. Репозиторий `Layron348/routine-week`
4. Render создаст `routine-week-web` и `routine-week-bot`
5. В **Environment** обоих сервисов:
   - `BOT_TOKEN` = токен
   - `MINI_APP_URL` = пока пусто
6. Дождись деплоя web → скопируй URL (`https://routine-week-web.onrender.com`)
7. Обнови `MINI_APP_URL` на этот URL в **web** и **bot** → Redeploy

**Минусы free:** сервис засыпает; SQLite может сброситься при redeploy.

### Альтернатива: Fly.io

```powershell
fly auth login
fly launch --config fly.toml --no-deploy
fly volumes create routine_data --region ams --size 1
fly secrets set BOT_TOKEN="..." MINI_APP_URL="https://routine-week.fly.dev"
fly deploy

fly apps create routine-week-bot
fly secrets set BOT_TOKEN="..." MINI_APP_URL="https://routine-week.fly.dev" -a routine-week-bot
fly deploy --config fly.bot.toml -a routine-week-bot
```

---

## Шаг 4. BotFather — финал

`/myapps` → Edit → **Web App URL** = `MINI_APP_URL` (HTTPS, без `/` в конце)

Проверка:
- Браузер: `https://ТВОЙ-URL/api/health` → `{"status":"ok"}`
- Telegram: `/start` → кнопка Mini App

---

## Переменные

| Переменная | Пример |
|------------|--------|
| `BOT_TOKEN` | от BotFather |
| `MINI_APP_URL` | `https://routine-week-web.onrender.com` |
| `DATA_DIR` | `/data` (Docker/Fly) |

---

## Локально (Docker)

```powershell
copy .env.example .env
# BOT_TOKEN и MINI_APP_URL=http://localhost:8000
docker compose up --build
```
