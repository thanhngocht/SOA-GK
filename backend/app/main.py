from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth.router import router as auth_router
from .users.router import router as users_router


from fastapi import FastAPI

app = FastAPI()



def create_app() -> FastAPI:
    app = FastAPI(title="iBanking")

    @app.get("/")
    def read_root():
        return {"message": "Welcome to iBanking API"}

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router, prefix="/api")
    app.include_router(users_router, prefix="/api")
    return app

app = create_app()
