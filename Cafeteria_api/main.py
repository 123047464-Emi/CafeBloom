from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import cocina, mesero, caja, admin

# Generación automática de tablas en base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cafetería API", version="1.0")

# Habilitar el intercambio de recursos de origen cruzado para React Native 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cocina.router)
app.include_router(mesero.router)
app.include_router(caja.router)
app.include_router(admin.router)