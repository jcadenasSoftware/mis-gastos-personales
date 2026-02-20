from fastapi import Depends, FastAPI

from app.firebase_auth import get_current_user

app = FastAPI(title="Mis Gastos Personales API")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.get("/me")
def me(user: dict = Depends(get_current_user)) -> dict:
    return {
        "uid": user.get("uid"),
        "email": user.get("email"),
        "name": user.get("name"),
        "picture": user.get("picture"),
    }
