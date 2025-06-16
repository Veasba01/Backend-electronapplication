# 📚 API Endpoints - Planillas y Aguinaldo

## 🎯 Descripción General

Este documento describe todos los endpoints disponibles para las entidades relacionadas con planillas y aguinaldo en el sistema.

---

## 📋 Planilla Quincenal

**Base URL:** `/planillas-quincenales`

### Endpoints Disponibles

#### 1. **Crear Planilla Quincenal**
```http
POST /planillas-quincenales
```

**Descripción:** Crea una nueva planilla quincenal con sus empleados asociados.

**Body (JSON):**
```json
{
  "fechaInicio": "2025-06-01",
  "fechaFinal": "2025-06-15",
  "razonSocial": { "id": 1 },
  "detalles": [
    {
      "panaderia": { "id": 1, "nombre": "Panadería Central" },
      "nombreEmpleado": "Juan",
      "primerApellidoEmpleado": "Pérez",
      "segundoApellidoEmpleado": "González",
      "cedulaEmpleado": "123456789",
      "salarioMes": 500000,
      "salarioHora": 2500,
      "horasSencillas": 80,
      "horasExtras": 10,
      "salarioNormal": 200000,
      "salarioExtras": 37500,
      "otrosIngresos": 0,
      "salarioTotalBruto": 237500,
      "ccss": 21375,
      "bpdc": 2375,
      "embargos": 0,
      "adelantos": 0,
      "salarioNeto": 213750
    }
  ]
}
```

**Respuesta (200):**
```json
{
  "id": 1,
  "fechaInicio": "2025-06-01",
  "fechaFinal": "2025-06-15",
  "totalesSalarioNormal": 200000,
  "totalesSalarioExtras": 37500,
  "totalesSalarioBruto": 237500,
  "totalesCCSS": 21375,
  "totalesBPDC": 2375,
  "totalesEmbargos": 0,
  "totalesAdelantos": 0,
  "totalesSalarioNeto": 213750,
  "razonSocial": { "id": 1, "nombre": "Panadería Musmanni S.A." },
  "detalles": [...]
}
```

**⚡ Funcionalidad Especial:** 
Este endpoint automáticamente registra cada empleado en la tabla de aguinaldo usando la fecha de la planilla para determinar el año fiscal correcto.

---

#### 2. **Obtener Todas las Planillas**
```http
GET /planillas-quincenales
```

**Descripción:** Obtiene todas las planillas quincenales con sus relaciones.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "fechaInicio": "2025-06-01",
    "fechaFinal": "2025-06-15",
    "totalesSalarioNormal": 200000,
    "totalesSalarioExtras": 37500,
    "totalesSalarioBruto": 237500,
    "razonSocial": { "id": 1, "nombre": "Panadería Musmanni S.A." },
    "detalles": [...]
  }
]
```

---

#### 3. **Obtener Planilla por ID**
```http
GET /planillas-quincenales/{id}
```

**Parámetros:**
- `id` (number): ID de la planilla quincenal

**Respuesta (200):**
```json
{
  "id": 1,
  "fechaInicio": "2025-06-01",
  "fechaFinal": "2025-06-15",
  "razonSocial": { "id": 1, "nombre": "Panadería Musmanni S.A." },
  "detalles": [
    {
      "id": 1,
      "nombreEmpleado": "Juan",
      "primerApellidoEmpleado": "Pérez",
      "segundoApellidoEmpleado": "González",
      "cedulaEmpleado": "123456789",
      "salarioTotalBruto": 237500,
      "panaderia": { "id": 1, "nombre": "Panadería Central" }
    }
  ]
}
```

---

#### 4. **Actualizar Planilla**
```http
PATCH /planillas-quincenales/{id}
```

**Parámetros:**
- `id` (number): ID de la planilla a actualizar

**Body (JSON):**
```json
{
  "fechaInicio": "2025-06-02",
  "fechaFinal": "2025-06-16"
}
```

---

#### 5. **Eliminar Planilla**
```http
DELETE /planillas-quincenales/{id}
```

**Parámetros:**
- `id` (number): ID de la planilla a eliminar

**Respuesta (200):** Sin contenido

---

## 👥 Planilla Empleado

**Base URL:** `/planilla-empleados`

### Endpoints Disponibles

#### 1. **Crear Detalle de Empleado**
```http
POST /planilla-empleados
```

**Descripción:** Crea un detalle individual de empleado en una planilla.

**Body (JSON):**
```json
{
  "planilla": { "id": 1 },
  "panaderia": { "id": 1 },
  "nombreEmpleado": "María",
  "primerApellidoEmpleado": "López",
  "segundoApellidoEmpleado": "Rodríguez",
  "cedulaEmpleado": "987654321",
  "salarioMes": 450000,
  "salarioHora": 2250,
  "horasSencillas": 80,
  "horasExtras": 5,
  "salarioNormal": 180000,
  "salarioExtras": 16875,
  "otrosIngresos": 0,
  "salarioTotalBruto": 196875,
  "ccss": 17719,
  "bpdc": 1969,
  "embargos": 0,
  "adelantos": 0,
  "salarioNeto": 177187
}
```

**⚡ Funcionalidad Especial:** 
Este endpoint también registra automáticamente el salario en la tabla de aguinaldo.

---

#### 2. **Obtener Todos los Empleados**
```http
GET /planilla-empleados
```

**Descripción:** Obtiene todos los detalles de empleados con sus relaciones.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "nombreEmpleado": "Juan",
    "primerApellidoEmpleado": "Pérez",
    "segundoApellidoEmpleado": "González",
    "cedulaEmpleado": "123456789",
    "salarioTotalBruto": 237500,
    "salarioNeto": 213750,
    "planilla": { "id": 1, "fechaInicio": "2025-06-01" },
    "panaderia": { "id": 1, "nombre": "Panadería Central" }
  }
]
```

---

#### 3. **Obtener Empleado por ID**
```http
GET /planilla-empleados/{id}
```

**Parámetros:**
- `id` (number): ID del detalle de empleado

---

#### 4. **Actualizar Empleado**
```http
PATCH /planilla-empleados/{id}
```

**Parámetros:**
- `id` (number): ID del empleado a actualizar

**Body (JSON):**
```json
{
  "horasExtras": 8,
  "salarioExtras": 20000,
  "salarioTotalBruto": 240000
}
```

---

#### 5. **Eliminar Empleado**
```http
DELETE /planilla-empleados/{id}
```

**Parámetros:**
- `id` (number): ID del empleado a eliminar

---

## 🎁 Aguinaldo

**Base URL:** `/aguinaldo`

### Endpoints Disponibles

#### 1. **Obtener Todos los Aguinaldos**
```http
GET /aguinaldo
```

**Descripción:** Obtiene todos los registros de aguinaldo ordenados por fecha de actualización.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "nombreCompleto": "Juan Pérez González",
    "cedulaEmpleado": "123456789",
    "razonSocial": "Panadería Musmanni S.A.",
    "panaderia": "Panadería Central",
    "acumuladoSalariosBrutos": 475000.00,
    "aguinaldoCalculado": 39583.33,
    "anio": 2025,
    "fechaCreacion": "2025-06-16T10:30:00Z",
    "fechaActualizacion": "2025-06-16T15:45:00Z"
  }
]
```

---

#### 2. **Obtener Año/Período Actual**
```http
GET /aguinaldo/ano-actual
```

**Descripción:** Obtiene información del año fiscal actual y su período.

**Respuesta (200):**
```json
{
  "anio": 2025,
  "periodo": "Diciembre 2024 - Noviembre 2025"
}
```

---

#### 3. **Buscar por Empleado**
```http
GET /aguinaldo/empleado/{cedula}?anio={anio}
```

**Parámetros:**
- `cedula` (string): Cédula del empleado
- `anio` (optional, number): Año fiscal específico

**Ejemplo:**
```http
GET /aguinaldo/empleado/123456789?anio=2025
```

**Respuesta (200):**
```json
{
  "id": 1,
  "nombreCompleto": "Juan Pérez González",
  "cedulaEmpleado": "123456789",
  "razonSocial": "Panadería Musmanni S.A.",
  "panaderia": "Panadería Central",
  "acumuladoSalariosBrutos": 475000.00,
  "aguinaldoCalculado": 39583.33,
  "anio": 2025
}
```

---

#### 4. **Buscar por Panadería**
```http
GET /aguinaldo/panaderia/{nombre}?anio={anio}
```

**Parámetros:**
- `nombre` (string): Nombre de la panadería
- `anio` (optional, number): Año fiscal específico

**Ejemplo:**
```http
GET /aguinaldo/panaderia/Panadería Central?anio=2025
```

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "nombreCompleto": "Juan Pérez González",
    "cedulaEmpleado": "123456789",
    "panaderia": "Panadería Central",
    "acumuladoSalariosBrutos": 475000.00,
    "aguinaldoCalculado": 39583.33,
    "anio": 2025
  }
]
```

---

#### 5. **Buscar por Año Fiscal**
```http
GET /aguinaldo/anio/{anio}
```

**Parámetros:**
- `anio` (number): Año fiscal específico

**Ejemplo:**
```http
GET /aguinaldo/anio/2025
```

---

#### 6. **Total por Panadería**
```http
GET /aguinaldo/total/panaderia/{nombre}?anio={anio}
```

**Parámetros:**
- `nombre` (string): Nombre de la panadería
- `anio` (optional, number): Año fiscal específico

**Respuesta (200):**
```json
{
  "total": 158333.32,
  "empleados": 4
}
```

---

#### 7. **Registrar Salario Manualmente**
```http
POST /aguinaldo/registrar-salario
```

**Descripción:** Permite registrar un salario manualmente en el aguinaldo.

**Body (JSON):**
```json
{
  "nombreCompleto": "María López Rodríguez",
  "cedulaEmpleado": "987654321",
  "razonSocial": "Panadería Musmanni S.A.",
  "panaderia": "Panadería Norte",
  "salarioTotalBruto": 300000,
  "anio": 2025,
  "fechaPlanilla": "2025-06-15"
}
```

**Respuesta (200):**
```json
{
  "id": 2,
  "nombreCompleto": "María López Rodríguez",
  "cedulaEmpleado": "987654321",
  "acumuladoSalariosBrutos": 300000.00,
  "aguinaldoCalculado": 25000.00,
  "anio": 2025
}
```

---

#### 8. **Recalcular Aguinaldos**
```http
POST /aguinaldo/recalcular?anio={anio}
```

**Parámetros:**
- `anio` (optional, number): Año fiscal específico

**Descripción:** Recalcula todos los aguinaldos de un año específico.

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "nombreCompleto": "Juan Pérez González",
    "aguinaldoCalculado": 39583.33,
    "anio": 2025
  }
]
```

---

#### 9. **Eliminar Registro**
```http
DELETE /aguinaldo/{id}
```

**Parámetros:**
- `id` (number): ID del registro a eliminar

**Respuesta (200):**
```json
{
  "message": "Registro de aguinaldo eliminado exitosamente"
}
```

---

#### 10. **Reset por Año**
```http
DELETE /aguinaldo/reset/{anio}
```

**Parámetros:**
- `anio` (number): Año fiscal a limpiar

**Descripción:** Elimina todos los registros de aguinaldo de un año específico.

**Respuesta (200):**
```json
{
  "message": "Todos los registros de aguinaldo del año 2025 han sido eliminados"
}
```

---

## 🔄 Flujo de Trabajo Recomendado

### Para Crear una Planilla Completa:

1. **Crear Planilla Quincenal** con todos los empleados:
   ```http
   POST /planillas-quincenales
   ```
   ✅ Esto automáticamente registra todos los empleados en aguinaldo

2. **Verificar Registros de Aguinaldo:**
   ```http
   GET /aguinaldo/panaderia/Panadería Central
   ```

3. **Consultar Totales:**
   ```http
   GET /aguinaldo/total/panaderia/Panadería Central
   ```

### Para Gestión de Aguinaldos:

1. **Ver Período Actual:**
   ```http
   GET /aguinaldo/ano-actual
   ```

2. **Consultar por Empleado:**
   ```http
   GET /aguinaldo/empleado/123456789
   ```

3. **Recalcular si es necesario:**
   ```http
   POST /aguinaldo/recalcular
   ```

---

## 🚨 Notas Importantes

- **Período Fiscal:** El aguinaldo se calcula por año fiscal (Diciembre-Noviembre)
- **Registro Automático:** Al crear planillas quincenales, los aguinaldos se registran automáticamente
- **Cálculo:** Aguinaldo = Salarios Acumulados ÷ 12
- **Tolerancia a Errores:** Si falla el registro de aguinaldo, no afecta la creación de planillas
- **Sin Referencias FK:** Los datos en aguinaldo se guardan como strings para evitar dependencias

---

## 📞 Códigos de Error Comunes

- **404:** Registro no encontrado
- **400:** Datos inválidos en el body
- **500:** Error interno del servidor

Para más detalles sobre manejo de errores, consultar los logs del servidor.
