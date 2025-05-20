import os
import csv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "Graficas")), name="static")

@app.get("/")
def read_root():
    return {"message": "Api encendida correctamente"}

@app.get("/grafico/barras")
def grafico_barras():
    return {"ruta": "/static/energia_por_fuente.gif"}

@app.get("/grafico/torta")
def grafico_torta():
    return {"ruta": "/static/participacion_renovable.png"}

@app.get("/grafico/lineas")
def grafico_lineas():
    return {"ruta": "/static/tendencia_capacidad.gif"}

@app.get("/grafico/area")
def grafico_area():
    return {"ruta": "/static/consumo_ren_vs_conv.gif"}

# --- NUEVO ENDPOINT PARA DATOS HISTÓRICOS ---
@app.get("/datos/historicos")
def datos_historicos():
    datos = []
    # Cambia aquí el nombre del archivo CSV
    csv_path = os.path.join(BASE_DIR, "01 renewable-share-energy.csv")
    with open(csv_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            datos.append(row)
    return datos