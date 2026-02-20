import os
from typing import Any

import firebase_admin
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth, credentials

_bearer = HTTPBearer(auto_error=False)


def _init_firebase_admin() -> None:
    if firebase_admin._apps:
        return

    project_id = os.getenv("FIREBASE_PROJECT_ID")
    creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    cred: credentials.Base
    if creds_path:
        cred = credentials.Certificate(creds_path)
    else:
        cred = credentials.ApplicationDefault()

    options: dict[str, Any] = {}
    if project_id:
        options["projectId"] = project_id

    firebase_admin.initialize_app(cred, options)


def _unauthorized(detail: str) -> HTTPException:
    return HTTPException(status_code=401, detail=detail)


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> dict[str, Any]:
    _init_firebase_admin()

    if not creds or creds.scheme.lower() != "bearer" or not creds.credentials:
        raise _unauthorized("missing_bearer_token")

    try:
        decoded = auth.verify_id_token(creds.credentials)
    except Exception as exc:  # noqa: BLE001
        raise _unauthorized("invalid_token") from exc

    return decoded
