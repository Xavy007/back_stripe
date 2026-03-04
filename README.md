# DOTSET — Plataforma Fullstack de Gestión Deportiva

> Automatización y centralización de las operaciones de las asociaciones municipales de Voleibol en Bolivia

---

## Descripción

Las asociaciones municipales de voleibol en Bolivia gestionan sus campeonatos, equipos y jugadores de forma manual, utilizando planillas físicas y hojas de cálculo que generan errores, demoras y falta de transparencia. **DOTSET** es una plataforma Full Stack que digitaliza y centraliza todas estas operaciones, desde la inscripción de clubes hasta la transmisión de resultados en tiempo real, eliminando el papel y garantizando el acceso inmediato a la información deportiva.

---

## Objetivo General

Desarrollar una plataforma Full Stack de gestión deportiva (DOTSET), para automatizar y organizar las operaciones centralizadas de las asociaciones municipales de voleibol en Bolivia, optimizando la administración de clubes y garantizando la transparencia mediante la difusión de resultados en tiempo real.

---

## Objetivos Específicos

1. **OE1 — Arquitectura e Integración de Datos**
   Definir una arquitectura Full-Stack integrando una base de datos híbrida (PostgreSQL y MongoDB) y construir una API REST mediante Node.js, garantizando la integridad referencial de los datos institucionales y soportando la alta concurrencia de eventos en los partidos.
   - **Métrica:** ≥ 28 tablas relacionales en PostgreSQL + 10 colecciones MongoDB, con ≥ 35 endpoints REST documentados y operativos.

2. **OE2 — Interfaz Web y Planillaje Digital**
   Diseñar una interfaz web administrativa en React.js orientada al planillaje digital FIVB, para optimizar el control de los jueces en cancha y centralizar la visualización de resultados.
   - **Métrica:** Planilla digital funcional con registro de puntos, rotaciones, sustituciones y sanciones en tiempo real (latencia < 500 ms vía Socket.IO).

3. **OE3 — Seguridad y Despliegue**
   Articular un esquema de seguridad (JWT/RBAC) y ejecutar el despliegue técnico del sistema, para proteger la información sensible de los atletas y asegurar la disponibilidad operativa de la plataforma.
   - **Métrica:** 6 roles diferenciados con control de acceso por ruta, bloqueo de cuenta tras 5 intentos fallidos y refresh token con expiración configurable.

---

## Alcance

**Incluye:**
- Gestión completa de clubes, equipos, jugadores, cuerpo técnico y árbitros
- Administración de campeonatos con múltiples categorías, fases y grupos
- Generación automática de fixture (Round Robin, grupos y eliminatorias)
- Inscripción y habilitación de jugadores por campeonato con carnet QR
- Planilla digital FIVB para registro de puntos, rotaciones, sustituciones y sanciones
- Transmisión de resultados en tiempo real mediante Socket.IO
- Tabla de posiciones y estadísticas actualizadas automáticamente
- Control de acceso por roles (admin, presidente, secretario, presidenteclub, representante, juez)
- API REST con más de 35 endpoints documentados

**No incluye:**
- Pagos en línea ni gestión financiera de clubes
- Aplicación móvil nativa (iOS/Android)
- Transmisión de video o streaming del partido
- Integración con federaciones nacionales o internacionales (FIVB oficial)
- Módulo de resultados históricos de temporadas anteriores a la implementación

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Runtime | Node.js | v18+ |
| Framework HTTP | Express.js | v4.18 |
| Base de datos relacional | PostgreSQL | v14+ |
| ORM relacional | Sequelize | v6 |
| Base de datos documental | MongoDB | v6+ |
| ODM documental | Mongoose | v8 |
| Tiempo real | Socket.IO | v4 |
| Frontend | React.js + Vite | v18 / v5 |
| Estilos | TailwindCSS | v3 |
| Autenticación | JWT + bcrypt | jsonwebtoken v9 |
| Carga de archivos | Multer | v1.4 |
| Variables de entorno | dotenv | v16 |

---

## Arquitectura

### Capas del Sistema

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                     │
│              React.js + Vite + TailwindCSS               │
│         HTTP/REST ↕              WebSocket ↕             │
└──────────────────────┬───────────────────┬───────────────┘
                       │                   │
┌──────────────────────▼───────────────────▼───────────────┐
│               SERVIDOR (Node.js + Express)               │
│  ┌─────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │   Routes    │→ │Controllers │→ │    Services      │  │
│  │  /api/...   │  │ (HTTP/REST)│  │ (lógica negocio) │  │
│  └─────────────┘  └────────────┘  └────────┬─────────┘  │
│  ┌──────────────────────────────┐           │            │
│  │     Socket.IO (puerto 8080)  │  ┌────────▼─────────┐ │
│  │  Rooms por partido en vivo   │  │  Repositories    │ │
│  └──────────────────────────────┘  │ (acceso a datos) │ │
│                                    └────────┬─────────┘ │
└─────────────────────────────────────────────┼───────────┘
                                              │
              ┌───────────────────────────────┴──────────┐
              │                                          │
┌─────────────▼────────────┐          ┌─────────────────▼──────────┐
│  PostgreSQL (datos       │          │  MongoDB (datos             │
│  relacionales)           │          │  operacionales)             │
│  28 tablas               │          │  10 colecciones             │
│  Sequelize ORM           │          │  Mongoose ODM               │
│  Migraciones versionadas │          │  PartidoDigital, Eventos,   │
│  Integridad referencial  │          │  Estadísticas, Sanciones... │
└──────────────────────────┘          └────────────────────────────┘
```

### Patrón de Diseño

El backend implementa **arquitectura en 3 capas** con patrón Repository:

```
Router → Controller → Service → Repository → Model (Sequelize/Mongoose)
```

- **Controller:** Maneja request/response HTTP, sin lógica de negocio
- **Service:** Orquesta operaciones, aplica reglas de dominio, gestiona transacciones
- **Repository:** Abstrae el acceso a la base de datos (Sequelize o Mongoose)

### Base de Datos Híbrida

| Tipo | Motor | Uso |
|------|-------|-----|
| Relacional | PostgreSQL | Datos maestros: clubes, equipos, jugadores, campeonatos, fixture |
| Documental | MongoDB | Datos operacionales: planilla en vivo, eventos, estadísticas de partido |

Los datos de MongoDB no reemplazan a PostgreSQL — complementan con alta frecuencia de escritura durante el partido y evitan el límite de 16 MB por documento separando eventos en colecciones independientes.

---

## Endpoints Core (Priorizados)

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Inicio de sesión — retorna `accessToken` + `refreshToken` |
| `POST` | `/api/auth/refresh` | Renovar access token con refresh token válido |
| `POST` | `/api/auth/logout` | Cerrar sesión e invalidar refresh token |

### Gestión de Campeonato

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/campeonatos` | Listar todos los campeonatos |
| `POST` | `/api/campeonatos` | Crear nuevo campeonato |
| `GET` | `/api/campeonato-categorias` | Listar categorías de un campeonato |
| `POST` | `/api/fixture/generar` | Generar fixture automático (Round Robin / Grupos) |
| `GET` | `/api/jornadas` | Listar jornadas del fixture |

### Clubes, Equipos y Jugadores

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/clubes` | Listar clubes activos |
| `POST` | `/api/clubes/crear` | Crear club (con logo — `multipart/form-data`) |
| `GET` | `/api/equipos` | Listar equipos |
| `POST` | `/api/equipos/crear` | Crear equipo (asociado a club + categoría) |
| `GET` | `/api/jugadores` | Listar jugadores |
| `POST` | `/api/jugadores` | Registrar jugador con foto |

### Inscripciones y Carnets

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/inscripciones` | Inscribir equipo a campeonato-categoría |
| `GET` | `/api/carnets` | Listar carnets por gestión/categoría |
| `POST` | `/api/carnets` | Emitir carnet con código QR |

### Partido en Vivo (Planilla FIVB)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/partidos` | Listar partidos del fixture |
| `POST` | `/api/partidos/:id/iniciar` | Iniciar partido — crea documento en MongoDB |
| `POST` | `/api/partidos/:id/punto` | Registrar punto en tiempo real |
| `POST` | `/api/partidos/:id/sustitucion` | Registrar sustitución FIVB |
| `POST` | `/api/partidos/:id/sancion` | Aplicar sanción (advertencia/expulsión) |
| `GET` | `/api/partidos/:id/planilla` | Obtener planilla completa del partido |

### Posiciones y Reportes

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/tabla-posiciones` | Tabla de posiciones por campeonato-categoría |
| `GET` | `/api/historial-campeonatos` | Historial de resultados por gestión |

---

## Variables de Entorno

Crea el archivo `.env` en `Backend/stripehub/` con el siguiente contenido:

```env
# Servidor
PORT=8080

# PostgreSQL
DB_NAME=dotset
DB_USER=postgres
DB_PWD=tu_password_postgresql
DB_HOST=localhost

# MongoDB (local)
MONGODB_URI=mongodb://localhost:27017/dotset

# MongoDB Atlas (alternativa en la nube)
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/dotset?retryWrites=true&w=majority

# JWT
JWT_SECRET=tu_clave_secreta_segura_minimo_32_caracteres
JWT_EXPIRES_IN=8h
JWT_REFRESH_SECRET=otra_clave_secreta_para_refresh
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Desarrollo (desactiva autenticación para pruebas)
SKIP_AUTH=false
```

> **Importante:** Nunca subas el archivo `.env` al repositorio. Está incluido en `.gitignore`.

---

## Cómo Ejecutar el Proyecto (Local)

### Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) v14 o superior
- [MongoDB](https://www.mongodb.com/) v6 o superior (local o Atlas)

Verifica las versiones:

```bash
node --version
npm --version
psql --version
mongod --version
```

### 1. Configurar PostgreSQL

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE dotset;

# Salir
\q
```

### 2. Configurar MongoDB

```bash
# Windows — iniciar servicio MongoDB
net start MongoDB

# O directamente con ruta de datos
mongod --dbpath "C:\data\db"
```

### 3. Instalar y ejecutar el Backend

```bash
cd "Backend/stripehub"

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# → Editar .env con tus credenciales

# Ejecutar migraciones (crea las 28 tablas)
npx sequelize-cli db:migrate

# Crear usuario administrador inicial
node crear-usuario-admin.js

# Iniciar servidor
node server.js
```

Salida esperada en consola:
```
MongoDB conectado: localhost
Servidor corriendo en http://localhost:8080
Socket.IO inicializado
```

### 4. Instalar y ejecutar el Frontend

```bash
cd "Frontend/puntoset"
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 5. Levantar el proyecto completo

Abre **dos terminales**:

```bash
# Terminal 1 — Backend
cd "Backend/stripehub" && node server.js

# Terminal 2 — Frontend
cd "Frontend/puntoset" && npm run dev
```

---

## Estructura del Proyecto

```
Monografia Tecnica/
├── Backend/
│   └── stripehub/
│       ├── server.js              # Entrada del servidor
│       ├── app.js                 # Configuración Express + rutas
│       ├── .env                   # Variables de entorno (no subir)
│       ├── .sequelizerc           # Config CLI de Sequelize
│       ├── config/
│       │   ├── config.js          # Config BD desde .env
│       │   └── mongodb.js         # Conexión MongoDB
│       ├── controllers/           # Manejo HTTP (request/response)
│       ├── services/              # Lógica de negocio
│       ├── repositories/          # Acceso a datos
│       ├── models/
│       │   ├── *.js               # Modelos Sequelize (PostgreSQL)
│       │   └── mongodb/           # Esquemas Mongoose (MongoDB)
│       ├── routes/                # Definición de rutas
│       ├── migrations/            # Versionado de esquema PostgreSQL
│       ├── sockets/               # Handlers Socket.IO
│       └── uploads/               # Archivos subidos (logos, fotos)
└── Frontend/
    └── puntoset/
        ├── src/
        │   ├── pages/             # Vistas principales
        │   ├── components/        # Componentes reutilizables
        │   ├── services/          # Clientes HTTP (axios)
        │   └── utils/             # Helpers y contexto de auth
        └── vite.config.js
```

---

## Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| `admin` | Acceso total al sistema |
| `presidente` | Gestión de campeonatos y fixture |
| `secretario` | Inscripciones, carnets y reportes |
| `presidenteclub` | Gestión de su club, equipos y jugadores |
| `representante` | Visualización de su equipo |
| `juez` | Planilla digital del partido asignado |

---

## Transmisión en Tiempo Real (Socket.IO)

El servidor Socket.IO corre en el mismo puerto que la API (`8080`).

| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `unirse_partido` | Cliente → Servidor | Unirse a la sala de un partido |
| `nuevo_punto` | Servidor → Clientes | Punto registrado en tiempo real |
| `fin_set` | Servidor → Clientes | Set finalizado |
| `partido_finalizado` | Servidor → Clientes | Partido terminado |
| `timeout` | Servidor → Clientes | Tiempo fuera solicitado |
| `sustitucion` | Servidor → Clientes | Cambio de jugador registrado |

---

## Comandos Útiles

```bash
# Estado de las migraciones
npx sequelize-cli db:migrate:status

# Revertir última migración
npx sequelize-cli db:migrate:undo

# Revertir todas las migraciones
npx sequelize-cli db:migrate:undo:all

# Recrear toda la BD desde cero
npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate

# Generar nueva migración
npx sequelize-cli migration:generate --name nombre-migracion

# Build del frontend para producción
cd Frontend/puntoset && npm run build
```

---

## Solución de Problemas Comunes

**Error: `ECONNREFUSED 5432` (PostgreSQL)**
- Verifica que PostgreSQL esté corriendo
- Confirma que las credenciales en `.env` sean correctas
- Verifica que la base de datos `dotset` exista

**Error: `MongoNetworkError`**
- Verifica que MongoDB esté corriendo: `net start MongoDB`
- Confirma la cadena de conexión en `MONGODB_URI`

**Error: `Cannot find module`**
- Ejecuta `npm install` en el directorio correspondiente

**Puerto 8080 en uso**
- Cambia el valor de `PORT` en `.env`
- Identifica el proceso: `netstat -ano | findstr :8080`

**Error de CORS**
- Verifica que `CORS_ORIGIN` en `.env` coincida con la URL del frontend (`http://localhost:5173`)

**Error en migraciones: `relación no existe`**
- Las migraciones se ejecutan en orden por nombre de archivo (timestamp)
- Verifica que los archivos en `migrations/` tengan timestamps correctos con `npx sequelize-cli db:migrate:status`

---

## Licencia

Proyecto académico desarrollado para la Maestría Full Stack — Universidad Católica de Bolivia. 2026.
