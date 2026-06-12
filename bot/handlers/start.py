from aiogram import Router
from aiogram.filters import CommandStart, Command
from aiogram.types import Message, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from config import MINI_APP_URL

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message):
    kb = InlineKeyboardMarkup(inline_keyboard=[[
        InlineKeyboardButton(
            text="📅 Open Routine Week",
            web_app=WebAppInfo(url=MINI_APP_URL),
        )
    ]])
    await message.answer(
        "👋 Привет! Это <b>Routine Week</b> — твой недельный планер.\n\n"
        "Нажми кнопку ниже, чтобы открыть Mini App 👇",
        parse_mode="HTML",
        reply_markup=kb,
    )


@router.message(Command("help"))
async def cmd_help(message: Message):
    await message.answer(
        "ℹ️ <b>Routine Week</b>\n\n"
        "• /start — открыть Mini App\n"
        "• /help — эта справка\n\n"
        "Mini App показывает недельный план:\n"
        "смены, тренировки, проект, задачи и стрик 🔥",
        parse_mode="HTML",
    )
