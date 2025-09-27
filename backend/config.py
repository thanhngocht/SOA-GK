# config.py
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env từ thư mục gốc project
BASE_DIR = Path(__file__).resolve().parent# quay lên /backend
ENV_PATH = BASE_DIR / ".env"

if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
    print(f"[Config] Loaded env from {ENV_PATH}")
else:
    print(f"[Config] WARNING: .env not found at {ENV_PATH}, fallback to system env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

JWT_SECRET = os.getenv("JWT_SECRET", "default-secret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))
