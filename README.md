<img width="1700" height="460" alt="Image" src="https://github.com/user-attachments/assets/01677639-18c8-4431-930c-793b20e9a95f" />

# UbiTour — Backend (API)

Breve API para gestionar usuarios, proveedores, experiencias, reservas, pagos y notificaciones.

## Requisitos previos

- Node.js 18+
- npm (incluido con Node)
- Docker Desktop (para ejecutar MySQL sin instalar)
- Visual Studio Code (recomendado)

## Rápido inicio (Windows)

1. Desde la raíz del proyecto arranca la base de datos:

   ```powershell
   docker compose up -d
   ```

   MySQL por defecto:
   - host: localhost:3306
   - database: bookings
   - user: root
   - password: fransql

2. Instalar dependencias (carpeta `api`):

   ```powershell
   cd api
   npm install
   ```

3. Variables de entorno

   - Copia `.env.example` a `.env` o crea `.env` en `api/` con las variables necesarias (DB, Mailtrap, JWT, etc).
   

4. Ejecutar migraciones de Prisma (crea/actualiza tablas):

   ```powershell
   npx prisma migrate dev
   ```

   Opcional: abrir Prisma Studio (Para ver los datos guardados)
   ```powershell
   npx prisma studio
   ```

5. Levantar el backend en modo desarrollo:

   ```powershell
   npm run start:dev
   ```

   La API queda disponible en: http://localhost:3000

## Correos (Mailtrap)

El proyecto está configurado para no enviar correos reales: usa Mailtrap durante desarrollo. Registra una cuenta y configura las variables de entorno correspondientes para ver los correos de confirmación.

## Frontend

La carpeta `web/` es 100% estática. Para abrirla rápido con VSCode:
- Click derecho en `web/index.html` → Open with Live Server

## Tests

Pruebas unitarias con Jest:
```powershell
npm run test        # ejecutar tests una vez
npm run test:watch  # modo watch
```

## Scripts útiles

Revisa `package.json` en `api/` para los scripts disponibles (`start`, `start:dev`, `build`, `test`, etc.).

## Resolución de problemas

- Si Prisma no encuentra la BD: verifica `DATABASE_URL` y que el contenedor MySQL esté corriendo.
- Si hay errores TS: reinicia el servidor de TypeScript / VSCode.
- Para forzar regenerar cliente Prisma:
  ```powershell
  npx prisma generate
  ```

## Tablero Kanban (Jira)
https://ubitour-metodosagiles-pf.atlassian.net/jira/software/projects/UBTK/boards/1?atlOrigin=eyJpIjoiNTliM2FkMjc3NTMwNDkzOWE0ZjM3ODE2MmJkNGJlYzgiLCJwIjoiaiJ9

## Integrantes
- Diego Alcantar Acosta
- Pablo Jesús Galán Valenzuela 
- Francisco de Jesús López Ruiz
- Jesús Eduardo Villanueva Godoy


  
