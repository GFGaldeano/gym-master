# Funcionalidad de Mantenimiento Completado

## Resumen de Cambios

Se ha implementado la funcionalidad solicitada para el sistema de mantenimiento que incluye:

1. **Nueva columna "estado" en la tabla Mantenimiento**
   - Valores posibles: "en proceso" y "completado"
   - Por defecto se crea en estado "en proceso"

2. **Actualización automática del equipamiento**
   - Cuando un mantenimiento cambia a "completado", se actualiza automáticamente el equipamiento relacionado:
     - `estado` → "operativo"
     - `ultima_revision` → fecha de completado del mantenimiento
     - `proxima_revision` → 3 meses después de la fecha de completado

## Archivos Modificados

### Interfaces
- `src/interfaces/mantenimiento.interface.ts`: Agregado campo `estado`
- `src/interfaces/asistencia.interface.ts`: Corregido error de sintaxis

### Servicios
- `src/services/mantenimientoService.ts`: 
  - Agregada lógica para actualización automática de equipamiento
  - Función `updateEquipamientoAfterMaintenance` para manejar las actualizaciones
  - Modificado `updateMantenimiento` para detectar cambios de estado a "completado"

### API Endpoints
- `src/app/api/mantenimientos/test-completion/route.ts`: Endpoint de prueba para demostrar la funcionalidad

## Cómo Usar la Nueva Funcionalidad

### 1. Crear un nuevo mantenimiento
```javascript
// El mantenimiento se crea por defecto en estado "en proceso"
const nuevoMantenimiento = {
    id_equipamiento: "uuid-del-equipamiento",
    tipo_mantenimiento: "preventivo",
    descripcion: "Revisión mensual",
    tecnico_responsable: "Juan Pérez",
    costo: 500,
    estado: "en proceso" // opcional, es el valor por defecto
};
```

### 2. Completar un mantenimiento
```javascript
// Actualizar el mantenimiento a "completado"
const actualizacion = {
    estado: "completado",
    fecha_mantenimiento: "2024-07-11" // opcional, usa fecha actual si no se proporciona
};

// Esta actualización disparará automáticamente:
// 1. Cambio de estado del equipamiento a "operativo"
// 2. Actualización de ultima_revision a la fecha de completado
// 3. Cálculo de proxima_revision (+3 meses)
```

### 3. API Endpoints Disponibles

#### Actualizar mantenimiento (existente)
```http
PUT /api/mantenimientos
Content-Type: application/json

{
    "id": "id-del-mantenimiento",
    "updateData": {
        "estado": "completado",
        "fecha_mantenimiento": "2024-07-11"
    }
}
```

#### Endpoint de prueba (nuevo)
```http
POST /api/mantenimientos/test-completion
Content-Type: application/json

{
    "maintenanceId": "id-del-mantenimiento",
    "fechaCompletado": "2024-07-11"
}
```

## Validación de la Implementación

La lógica ha sido validada con tests que confirman:

1. ✅ Equipamiento se actualiza a estado "operativo"
2. ✅ `ultima_revision` se establece en la fecha de completado
3. ✅ `proxima_revision` se calcula correctamente (+3 meses)
4. ✅ Los cambios solo se aplican cuando el estado cambia a "completado"
5. ✅ No se duplican actualizaciones si ya está completado

## Ejemplos de Uso

### Escenario 1: Mantenimiento completado hoy
- Fecha de completado: 2024-07-11
- `ultima_revision`: 2024-07-11
- `proxima_revision`: 2024-10-11

### Escenario 2: Mantenimiento completado en fecha específica
- Fecha de completado: 2024-01-15
- `ultima_revision`: 2024-01-15
- `proxima_revision`: 2024-04-15

## Consideraciones de Seguridad

- Todas las actualizaciones se realizan en transacciones
- Se valida que el mantenimiento exista antes de proceder
- Se maneja el control de errores para evitar estados inconsistentes
- Los cambios solo se aplican cuando realmente cambia el estado a "completado"