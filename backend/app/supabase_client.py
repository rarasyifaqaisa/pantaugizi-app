from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("https://ppvppuqaaxwjwkdbthwm.supabase.co")
SUPABASE_KEY = os.getenv("sb_secret_CY3R-5oFZMFestjhRC0gnw_dHc3wnil")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)