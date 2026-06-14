## Prueba Técnica - Evaluación Angular y .NET

#### Descripción General

Este proyecto corresponde a una aplicación web orientada a la gestión de consentimiento de cookies y administración de políticas.  
La solución fue desarrollada utilizando Angular para el frontend y .NET 8 Web API para el backend, incorporando persistencia de datos mediante SQL Server Express.

---

#### Arquitectura de la Solución

La arquitectura del sistema se compone de:

- Frontend desarrollado en Angular.
- Backend desarrollado en .NET 8 Web API.
- Base de datos SQL Server Express.
- Uso de Entity Framework Core para el acceso y gestión de datos.

La comunicación entre frontend y backend se realiza mediante servicios REST.

---

#### Backend

El backend implementa un CRUD completo para la administración de políticas de cookies.

---

#### Funcionalidades principales

- Obtener políticas almacenadas.
- Crear nuevas políticas.
- Editar políticas existentes.
- Eliminar políticas.

Además, se configuró CORS para permitir la correcta comunicación entre la API y el frontend desarrollado en Angular.

---

#### Frontend

La aplicación incluye las siguientes funcionalidades:

- Banner de consentimiento de cookies.
- Modal de configuración de preferencias.
- Página pública de políticas.
- Panel administrativo para gestionar políticas.

Las preferencias seleccionadas por el usuario se almacenan utilizando localStorage.

---

#### Base de Datos

La persistencia de la información se realiza mediante SQL Server Express.

Se utilizó Entity Framework Core para:

- Crear migraciones.
- Generar tablas automáticamente.
- Gestionar operaciones CRUD desde la API.

---

### Instrucciones de Ejecución

#### Backend

1. Ingresar a la carpeta del backend:

```bash
cd CookieApi
```

2. Configurar la cadena de conexión en el archivo `appsettings.json`.

3. Ejecutar las migraciones:

```bash
dotnet ef database update
```

4. Ejecutar la API:

```bash
dotnet run
```
---

#### Frontend

1. Ingresar a la carpeta del frontend:

```bash
cd tutorial
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar la aplicación:

```bash
ng serve
```

La aplicación quedará disponible en:

```bash
http://localhost:4200
```

#### Pruebas Realizadas

Para validar el correcto funcionamiento del sistema se realizaron las siguientes pruebas:

- Persistencia de preferencias en localStorage.
- Consumo correcto de endpoints REST.
- Funcionamiento del CRUD de políticas.
- Persistencia de datos en SQL Server.
- Comunicación correcta entre frontend y backend.


#### Tecnologías Utilizadas

- Angular 18
- .NET 8
- SQL Server Express
- Entity Framework Core
- TypeScript
- HTML5
- CSS3
