# UbiTour

Plataforma de reservas para experiencias locales.  
Arquitectura Continua basada en módulos, con comunicación asíncrona mediante RabbitMQ.

## Tecnologías principales
- NestJS (Backend modular + MVC)
- Prisma + MySQL
- RabbitMQ (Event-Driven)
- HTML + Tailwind + htmx

## Comandos iniciales
1. `docker compose up -d`
2. `cd api && npm i && npx prisma migrate dev --name init && npm run start:dev`
3. Abre `web/index.html` en el navegador.
