# Este código genera un archivo Json con rutinas al azar según el grupo muscular a trabajar

import random
import json

# Datos simulados de ejercicios
ejercicios = [
    {"grupo_muscular": "Pecho", "nombre": "Press banca"},
    {"grupo_muscular": "Pecho", "nombre": "Aperturas"},
    {"grupo_muscular": "Espalda", "nombre": "Remo con barra"},
    {"grupo_muscular": "Espalda", "nombre": "Dominadas"},
    {"grupo_muscular": "Piernas", "nombre": "Sentadillas"},
    {"grupo_muscular": "Piernas", "nombre": "Prensa"},
    {"grupo_muscular": "Hombros", "nombre": "Press militar"},
    {"grupo_muscular": "Bíceps", "nombre": "Curl con barra"},
    {"grupo_muscular": "Tríceps", "nombre": "Fondos"},
]

dias_semana = ["lunes", "martes", "miércoles", "jueves", "viernes"]

def generar_rutina_semana():
    rutina = {}
    grupos_asignados = set()

    for dia in dias_semana:
        grupo = random.choice([e["grupo_muscular"] for e in ejercicios if e["grupo_muscular"] not in grupos_asignados])
        grupos_asignados.add(grupo)

        ejercicios_dia = [
            e for e in ejercicios if e["grupo_muscular"] == grupo
        ]
        seleccionados = random.sample(ejercicios_dia, k=min(2, len(ejercicios_dia)))

        rutina[dia] = [
            {
                "grupo_muscular": e["grupo_muscular"],
                "ejercicio": e["nombre"],
                "series": random.randint(3, 5),
                "repeticiones": random.choice([8, 10, 12]),
                "descanso": f"{random.randint(45, 90)}s"
            }
            for e in seleccionados
        ]

    return rutina

def generar_rutina_mensual():
    return {
        f"semana_{i+1}": generar_rutina_semana()
        for i in range(4)
    }

# Exporto como JSON
if __name__ == "__main__":
    rutina = generar_rutina_mensual()
    print(json.dumps(rutina, indent=2, ensure_ascii=False))
