import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log(" Buscando usuario PROVIDER...");

  // 1. Buscar o crear un usuario con rol PROVIDER
  let user = await prisma.user.findFirst({
    where: { role: "PROVIDER" }
  });

  if (!user) {
    console.log(" No existe un usuario PROVIDER. Creando uno...");

    user = await prisma.user.create({
      data: {
        email: "provider@test.com",
        password: "$2b$10$Oimc7/rvThkErZvWmm3pxOFHZzAQnltOd3t0N8MHp.Fx8r2LtFWSm", // "123456"
        name: "Proveedor Demo",
        role: "PROVIDER",
        isVerified: true,
      }
    });
  }

  console.log(" Usuario PROVIDER listo:", user.id);

  // 2. Buscar o crear Provider asociado
  let provider = await prisma.provider.findFirst({
    where: { userId: user.id },
  });

  if (!provider) {
    console.log(" No existe registro en Provider. Creándolo...");

    provider = await prisma.provider.create({
      data: {
        userId: user.id,
        phone: "123456789"
      }
    });
  }

  console.log(" Provider listo:", provider.id);

  await prisma.experience.deleteMany();
  console.log(" Experiencias anteriores borradas.");

  console.log(" Insertando experiencias...");
  await prisma.experience.createMany({
    data: [
      {
        providerId: provider.id,
        title: 'Tour histórico por Madrid',
        description: 'Recorre el centro histórico con guía local.',
        price: 35.0,
        capacity: 20,
        startAt: new Date('2025-11-27'),
        endAt: new Date('2025-11-27'),
        location: { city: 'Madrid' },
        photos: [
          "https://images.unsplash.com/photo-1758499579274-1de8da3271a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwdG91ciUyMGV4cGVyaWVuY2V8ZW58MXx8fHwxNzYyOTkwMTAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ],
      },

      {
        providerId: provider.id,
        title: 'Gastronomía local en Barcelona',
        description: 'Degusta productos locales con un chef profesional.',
        price: 50.0,
        capacity: 12,
        startAt: new Date('2025-12-02'),
        endAt: new Date('2025-12-02'),
        location: { city: 'Barcelona' },
        photos: [
          "https://images.unsplash.com/photo-1631692994621-d26f83cf4db8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2NhbCUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzYyOTkwMTAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ],
      },

      {
        providerId: provider.id,
        title: 'Clase de cocina mediterránea',
        description: 'Aprende recetas mediterráneas tradicionales.',
        price: 80.0,
        capacity: 15,
        startAt: new Date('2025-12-10'),
        endAt: new Date('2025-12-10'),
        location: { city: 'Sevilla' },
        photos: [
          "https://images.unsplash.com/photo-1554881070-0f77dbb0f2b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdWx0dXJhbCUyMHdvcmtzaG9wfGVufDF8fHx8MTc2Mjk5MDEwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ],
      },
    ],
  });

  console.log(" Seed ejecutado con éxito.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
