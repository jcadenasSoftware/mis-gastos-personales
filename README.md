# Mis Gastos Personales

Monorepo:

- `frontend/`: Next.js + pnpm
- `backend/`: FastAPI + uv

## Requisitos

- Node.js
- pnpm
- Python
- uv

## Variables de entorno

Frontend:

- Copia `frontend/.env.local.example` a `frontend/.env.local`

Backend:

- Copia `backend/.env.example` a `backend/.env`

## Correr en local

Frontend:

```bash
pnpm install
pnpm dev
```

Backend:

```bash
uv pip install -e .
uvicorn app.main:app --reload
```