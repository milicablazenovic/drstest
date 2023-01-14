#import redis
from dotenv import load_dotenv

load_dotenv()

class ApplicationConfig:

    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = "None" 

    SESSION_TYPE = "filesystem"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    #SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")