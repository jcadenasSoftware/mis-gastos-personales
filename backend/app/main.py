from fastapi import FastAPI

app = FastAPI(title="Mis Gastos Personales API")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
