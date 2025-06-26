#Este codigo:

#✅ Lee los datos de los socios
#✅ Filtra y organiza ejercicios según perfil
#✅ Evita repeticiones de grupos musculares
#✅ Guarda el resultado en JSON local
#✅ Inserta o actualiza rutinas en Supabase


import pandas as pd
import json
import random
import os

# Conexión a Supabase
from supabase import create_client, Client

SUPABASE_URL = "https://brrxvwgjkuofcgdnmnfb.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycnh2d2dqa3VvZmNnZG5tbmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNzQxNjIsImV4cCI6MjA2NDc1MDE2Mn0.pJDbApLOkF0LGAAV-d4AJ-HUoQ-13FtLIVMJXwlqT5s"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Crear carpeta para guardar los JSON si no existe
os.makedirs("rutinas", exist_ok=True)

# Cargar archivos locales simulados
def cargar_datos():
    ejercicios = pd.read_csv("data/ejercicios.csv")
    niveles = pd.read_csv("data/niveles.csv")
    objetivos = pd.read_csv("data/objetivos.csv")
    return ejercicios, niveles, objetivos

# Filtrar ejercicios por nivel y objetivo
def filtrar_ejercicios(ejercicios, nivel, objetivo):
    return ejercicios[
        (ejercicios["id_nivel"] == nivel) & (ejercicios["id_objetivo"] == objetivo)
    ]

# Generar rutina mensual evitando repetir grupos musculares consecutivos
def generar_rutina_sin_repetir_grupos(ejercicios_filtrados, dias_por_semana=3, id_socio=None):
    grupos = list(ejercicios_filtrados["grupo_muscular"].unique())

    if len(grupos) < 2:
        print(f"⚠️ No hay suficientes grupos musculares para el socio ID {id_socio}.")
        return None

    rutina = {}
    for semana in range(1, 5):
        dias = {}
        dias_disponibles = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
        random.shuffle(dias_disponibles)
        dias_usados = dias_disponibles[:dias_por_semana]

        grupos_usados_dia_anterior = set()

        for dia in dias_usados:
            ejercicios_dia = []
            grupos_disponibles = list(set(grupos) - grupos_usados_dia_anterior)
            if len(grupos_disponibles) < 2:
                grupos_disponibles = grupos

            try:
                grupos_dia = random.sample(grupos_disponibles, 2)
            except ValueError:
                print(f"⚠️ No se pueden seleccionar 2 grupos para el socio ID {id_socio}. Día omitido.")
                continue

            grupos_usados_dia_anterior = set(grupos_dia)

            for grupo in grupos_dia:
                ejercicios_grupo = ejercicios_filtrados[ejercicios_filtrados["grupo_muscular"] == grupo]
                if not ejercicios_grupo.empty:
                    ejercicio = ejercicios_grupo.sample(1).iloc[0]
                    ejercicios_dia.append({
                        "grupo_muscular": grupo,
                        "ejercicio": ejercicio["nombre"],
                        "series": random.choice([3, 4]),
                        "repeticiones": random.choice([8, 10, 12]),
                        "descanso": random.choice(["60s", "90s"]),
                        "imagen": ejercicio["imagen_url"]
                    })
            dias[dia] = ejercicios_dia

        rutina[f"semana_{semana}"] = dias

    return rutina

# Guardar JSON local
def guardar_json(rutina, nombre_archivo="rutina_generada.json"):
    with open(nombre_archivo, "w", encoding="utf-8") as f:
        json.dump(rutina, f, indent=4, ensure_ascii=False)

# Guardar o actualizar rutina en Supabase
def guardar_en_supabase(rutina_json, id_socio):
    try:
        resultado = supabase.table("rutina").select("id").eq("id_socio", id_socio).execute()

        if resultado.data and len(resultado.data) > 0:
            id_rutina_existente = resultado.data[0]["id"]
            respuesta = supabase.table("rutina").update({
                "contenido": rutina_json
            }).eq("id", id_rutina_existente).execute()
            print(f"🔄 Rutina actualizada para el socio {id_socio}.")
        else:
            data = {
                "id_socio": id_socio,
                "contenido": rutina_json
            }
            respuesta = supabase.table("rutina").insert(data).execute()
            print(f"✅ Nueva rutina guardada para el socio {id_socio}.")

    except Exception as e:
        print("❌ Error al guardar en Supabase:", e)

# ----------------------------------------------------------------------------------------
# 🚀 Proceso principal
# Lee la lista de socios desde un archivo CSV y genera una rutina mensual personalizada
# para cada uno, guardando el resultado en formato JSON y subiéndolo a Supabase.
# ----------------------------------------------------------------------------------------

if __name__ == "__main__":
    ejercicios, niveles, objetivos = cargar_datos()
    socios_df = pd.read_csv("data/socios_ejemplo.csv")

    for _, socio in socios_df.iterrows():
        id_socio = socio["id_socio"]
        nivel = socio["nivel"]
        objetivo = socio["objetivo"]
        dias_por_semana = socio["dias_por_semana"]

        print(f"\n🔄 Generando rutina para {socio['nombre']} (ID: {id_socio})...")

        ejercicios_filtrados = filtrar_ejercicios(ejercicios, nivel=nivel, objetivo=objetivo)
        rutina = generar_rutina_sin_repetir_grupos(
            ejercicios_filtrados,
            dias_por_semana=dias_por_semana,
            id_socio=id_socio
        )

        if rutina is None:
            print(f"⛔ No se pudo generar rutina para el socio {id_socio}.")
            continue

        nombre_archivo = f"rutinas/rutina_socio_{id_socio}.json"
        guardar_json(rutina, nombre_archivo=nombre_archivo)
        guardar_en_supabase(rutina, id_socio)

    print("\n✅ Todas las rutinas fueron procesadas correctamente.")
