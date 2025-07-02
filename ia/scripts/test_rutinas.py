# test_rutinas.py
# Test unitarios para verificar la generación de rutinas

import pytest
import json

# Cargar archivo generado por el generador
with open("rutinas/rutina_socio_1.json", "r", encoding="utf-8") as f:
    rutina = json.load(f)

# Verificar estructura principal del JSON
def test_estructura_general():
    assert isinstance(rutina, dict)
    assert all(semana.startswith("semana_") for semana in rutina.keys())

# Verificar que cada día tenga 6 u 8 ejercicios
def test_cantidad_ejercicios_por_dia():
    for semana in rutina.values():
        for dia, ejercicios in semana.items():
            assert len(ejercicios) in [6, 8], f"{dia} tiene {len(ejercicios)} ejercicios"

# Verificar campos obligatorios en cada ejercicio
def test_campos_ejercicio():
    campos_requeridos = {"grupo_muscular", "ejercicio", "series", "repeticiones", "descanso", "imagen"}
    for semana in rutina.values():
        for dia, ejercicios in semana.items():
            for ejercicio in ejercicios:
                assert campos_requeridos.issubset(ejercicio.keys())

# Verificar que no haya grupos musculares repetidos en un solo grupo (6 ejercicios)
def test_grupos_repetidos_en_dia_focalizado():
    for semana in rutina.values():
        for dia, ejercicios in semana.items():
            grupos = [e["grupo_muscular"] for e in ejercicios]
            if len(grupos) == 6:
                assert len(set(grupos)) == 1

# Verificar que en combinados haya 2 grupos distintos con 4 ejercicios cada uno
def test_dia_combinado():
    for semana in rutina.values():
        for dia, ejercicios in semana.items():
            if len(ejercicios) == 8:
                grupos = [e["grupo_muscular"] for e in ejercicios]
                unicos = list(set(grupos))
                assert len(unicos) == 2
                assert grupos.count(unicos[0]) == 4
                assert grupos.count(unicos[1]) == 4
