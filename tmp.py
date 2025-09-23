from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
print(pwd_context.hash("123"))   # hash mật khẩu "123"
