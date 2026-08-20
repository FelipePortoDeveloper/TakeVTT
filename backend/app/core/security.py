from passlib.context import CryptContext

password_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password:str) -> str:
    truncated_password = password[:72]
    return password_context.hash(truncated_password)

def verify_password(plain_password:str, hashed_password: str) -> bool:
    truncated_password = plain_password[:72]
    return password_context.verify(truncated_password, hashed_password)