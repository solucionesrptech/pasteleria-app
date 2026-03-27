const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@pasteleria.local';
const ADMIN_PASSWORD = 'Admin123';

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, role: UserRole.ADMINISTRADOR },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      role: UserRole.ADMINISTRADOR,
    },
  });

  console.log('Usuario administrador listo:', admin.email);
  console.log('  Email:', ADMIN_EMAIL);
  console.log('  Contraseña:', ADMIN_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
