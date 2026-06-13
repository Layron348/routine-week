import os
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

BOT_TOKEN: str = os.environ["BOT_TOKEN"]
MINI_APP_URL: str = os.getenv("MINI_APP_URL", "http://localhost:5173")
