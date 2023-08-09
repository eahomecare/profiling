const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();

async function createMappings() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: {
          include: { defaultPermissions: true },
        },
      },
    });

    for (const user of users) {
      for (const role of user.role) {
        for (const permission of role.defaultPermissions) {
          const existingMapping =
            await prisma.userRolePermissionMapping.findFirst(
              {
                where: {
                  userId: user.id,
                  roleId: role.id,
                  permissionId: permission.id,
                },
              },
            );

          if (!existingMapping) {
            await prisma.userRolePermissionMapping.create(
              {
                data: {
                  userId: user.id,
                  roleId: role.id,
                  permissionId: permission.id,
                },
              },
            );
          }
        }
      }
    }

    console.log(
      'User Role Permission Mappings created successfully.',
    );
  } catch (error) {
    console.error(
      'Error creating User Role Permission Mappings:',
      error,
    );
  } finally {
    await prisma.$disconnect();
  }
}

createMappings();
