# Catálogo de Planetas

Aplicación web con frontend en Next.js (React) y servidor Node.js + Socket.IO para una trivia multiplayer en tiempo real.

API pública usada: https://api.le-systeme-solaire.net/rest/bodies/
---

Requisitos
- Node.js >= 16 (recomendado 18+)
- npm

## Preparación (una sola vez)

1. Sitúate en el repositorio:

```powershell
cd C:\tu_carpeta\Catalogo_Planetas
```

2. Instala dependencias del frontend (raíz):

```powershell
npm install
```

3. Instala dependencias del servidor (carpeta `server`):

```powershell
cd server
npm install
```

## Configuración de entorno

- Copia la plantilla de variables en `server`:

```powershell
cd server
copy .env.example .env
notepad .env
# En .env establece al menos:
# JWT_SECRET=una_clave_larga_y_random
# DB_FILE=./data.sqlite   (opcional)
# PORT=4000              (opcional)
```

- Si el socket corre en otra URL, crea `.env.local` en la raíz con:

```text
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

## Ejecución en desarrollo (dos terminales)

- **Terminal 1 — servidor Socket/HTTP**

```powershell
cd C:\desarrollo_web\Catalogo_Planetas\server
npm start
# Espera ver logs: [sqlite] using DB file ... y Socket.IO server running on port 4000
```

- **Terminal 2 — frontend (Next.js dev)**

```powershell
cd C:\desarrollo_web\Catalogo_Planetas
npm run dev
# Abrir: http://localhost:3000
```

## Flujo de verificación rápido

1. Abrir `http://localhost:3000/login` → crear usuario y entrar.
2. Tras login el token JWT se guarda en `localStorage` como `TRIVIA_TOKEN`.
3. Ir a `/trivia` → crear sala, copiar código y unir otro navegador (o pestaña en incógnito) para probar la trivia en tiempo real.

## Comprobación del fichero SQLite (opcional)

```powershell
dir .\server\data.sqlite
# o si tienes sqlite3 CLI:
sqlite3 .\server\data.sqlite "SELECT id, name FROM users;"
```

## Build y despliegue (resumen)

```powershell
# Frontend (producción)
cd C:\desarrollo_web\Catalogo_Planetas
npm run build
npm start   # Next.js en modo producción (puerto 3000)

# Servidor
cd server
npm start
```

## Problemas comunes y notas

- `better-sqlite3` puede necesitar Visual C++ Build Tools en Windows. Si falla la instalación, instala las herramientas de compilación y vuelve a ejecutar `npm install` en `server`.
- Si faltan paquetes como `dotenv`, ejecuta `npm install` dentro de `server`.
- Si hay conflicto de puertos, ajusta `PORT` en `server/.env` o `NEXT_PUBLIC_SOCKET_URL` en `.env.local`.
- No comitees `server/.env`. Usa `server/.env.example` como plantilla y establece `JWT_SECRET` en el entorno del host en producción.
- Para producción se recomienda usar cookies `HttpOnly` + refresh tokens en lugar de `localStorage` para almacenar JWT.
---

Si quieres, puedo añadir un script PowerShell (`run-dev.ps1`) que abre ambos procesos en terminales, o crear instrucciones para Docker.
