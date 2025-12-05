import { PrismaClient, ReservationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const providerId = "1138e5bd-8132-449f-9242-f6aaad143806"; // provider real
  const userId = "cc16f3bd-a415-4adc-bffe-94a54a76d3ea"; // visitante que reservará

  console.log("Buscando experiencias del provider...");

  const experiences = await prisma.experience.findMany({
    where: { providerId: providerId },
  });

  if (experiences.length === 0) {
    throw new Error("⚠ El proveedor no tiene experiencias registradas.");
  }

  console.log(`→ Se encontraron ${experiences.length} experiencias.`);

  const reservationsData = experiences.slice(0, 5).map((exp, index) => ({
    userId,
    experienceId: exp.id,
    qty: Math.floor(Math.random() * 4) + 1,
    amountTotal: exp.price,
    status: ReservationStatus.PAID,
  }));

  console.log("Insertando reservas...");

  for (const r of reservationsData) {
    await prisma.reservation.create({ data: r });
  }

  console.log("✔ Reservas creadas con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ ERROR: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });