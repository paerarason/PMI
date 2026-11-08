"""STEP → PMI → features → 2D drawing API."""
from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.routers import models

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")

app = FastAPI(title="STEP feature recognition API", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)
# Meshes and drawings run to megabytes of JSON or floats: compress anything over 2 kB on the way out.
app.add_middleware(GZipMiddleware, minimum_size=2048)
app.include_router(models.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
