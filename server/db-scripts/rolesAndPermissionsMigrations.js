const {
  PrismaClient,
} = require('@prisma/client');

// Initialize Prisma Clients for source and destination databases
const prismaSource = new PrismaClient({
  datasources: {
    db: {
      url: 'mongodb://mongo:example@localhost/eaProfiling?authSource=admin',
    },
  },
});
const prismaDestination = new PrismaClient({
  datasources: {
    db: {
      url: 'mongodb://mongo:example@localhost/eaProfilingLive?authSource=admin',
    },
  },
});

async function transferRolesAndPermissions() {
  try {
    // Fetch Roles and Permissions from source database
    const roles =
      await prismaSource.role.findMany({
        include: { defaultPermissions: true },
      });
    const permissions =
      await prismaSource.permission.findMany();

    // Check and Transfer Roles to destination database
    for (const role of roles) {
      const existingRole =
        await prismaDestination.role.findUnique({
          where: { name: role.name },
        });
      if (!existingRole) {
        await prismaDestination.role.create({
          data: role,
        });
        console.log(
          `Role '${role.name}' transferred successfully.`,
        );
      } else {
        console.log(
          `Role '${role.name}' already exists. Skipping...`,
        );
      }
    }

    // Check and Transfer Permissions to destination database
    for (const permission of permissions) {
      const existingPermission =
        await prismaDestination.permission.findUnique(
          { where: { name: permission.name } },
        );
      if (!existingPermission) {
        await prismaDestination.permission.create(
          { data: permission },
        );
        console.log(
          `Permission '${permission.name}' transferred successfully.`,
        );
      } else {
        console.log(
          `Permission '${permission.name}' already exists. Skipping...`,
        );
      }
    }

    // Check and Transfer the specified User
    const user =
      await prismaSource.user.findUnique({
        where: { email: 'homecare@ea.in' },
        include: {
          userRolePermissionMapping: true,
        },
      });

    if (user) {
      const existingUser =
        await prismaDestination.user.findUnique({
          where: { email: user.email },
        });
      if (!existingUser) {
        await prismaDestination.user.create({
          data: user,
        });
        console.log(
          `User with email '${user.email}' transferred successfully.`,
        );
      } else {
        console.log(
          `User with email '${user.email}' already exists. Skipping...`,
        );
      }
    } else {
      console.log(
        "Specified user 'homecare@ea.in' not found in source database. Skipping...",
      );
    }

    console.log('Migration completed.');
  } catch (error) {
    console.error(
      'An error occurred during the migration:',
      error,
    );
  } finally {
    await prismaSource.$disconnect();
    await prismaDestination.$disconnect();
  }
}

transferRolesAndPermissions();
