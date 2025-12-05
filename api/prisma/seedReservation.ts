import { PrismaClient, ReservationStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log(" Iniciando seed de reservaciones...");

  // Buscar un VISITOR real
  const visitor = await prisma.user.findFirst({
    where: { role: "VISITOR" }
  });

  if (!visitor) {
    throw new Error(" No existe ningún usuario VISITOR en la BD.");
  }

  console.log("✔ Visitor encontrado:", visitor.id);

  // Provider real
  const providerId = "1138e5bd-8132-449f-9242-f6aaad143806";

  // Experiencias del provider
  const experiencias = await prisma.experience.findMany({
    where: { providerId }
  });

  if (experiencias.length === 0) {
    throw new Error(" El proveedor no tiene experiencias registradas.");
  }

  console.log(`✔ Experiencias encontradas: ${experiencias.length}`);

  const estados: ReservationStatus[] = [
    "PAID",
    "CREATED",
    "CANCELLED",
    "REFUNDED"
  ];

  for (let i = 0; i < 10; i++) {
    const exp = experiencias[Math.floor(Math.random() * experiencias.length)];
    const qty = Math.floor(Math.random() * 4) + 1;
    const status = estados[Math.floor(Math.random() * estados.length)];

    const reservation = await prisma.reservation.create({
      data: {
        userId: visitor.id,
        experienceId: exp.id,
        qty,
        amountTotal: Number(exp.price) * qty,
        status,
        createdAt: new Date(
          2025,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        )
      }
    });

    if (status === "PAID") {
      await prisma.payment.create({
        data: {
          reservationId: reservation.id,
          status: "SUCCEEDED",
          amount: reservation.amountTotal,
          raw: {}
        }
      });
    }
  }

  console.log(" Seed completada con éxito.");
}

main()
  .catch((e) => console.error(" ERROR:", e))
  .finally(async () => prisma.$disconnect());