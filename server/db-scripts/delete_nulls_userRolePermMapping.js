const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteUserRolePermissionMappings() {
  try {
    // Step 1: Retrieve all user, permission, and role IDs from the Prisma model.
    const users = await prisma.user.findMany();
    const permissions = await prisma.permission.findMany();
    const roles = await prisma.role.findMany();

    // Step 2: Retrieve all mappings without including related records
    const mappings = await prisma.userRolePermissionMapping.findMany();

    // Step 3: Filter mappings with non-existent users, permissions, or roles
    const mappingsToDelete = mappings.filter(
      mapping => 
        !users.some(user => user.id === mapping.userId) ||
        !roles.some(role => role.id === mapping.roleId) ||
        !permissions.some(permission => permission.id === mapping.permissionId)
    );

    // Step 4: Delete the mappings
    for (let mapping of mappingsToDelete) {
      await prisma.userRolePermissionMapping.delete({
        where: { id: mapping.id },
      });
    }

    console.log(`Deleted ${mappingsToDelete.length} userRolePermissionMapping(s).`);
  } catch (error) {
    console.error('Error deleting userRolePermissionMappings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUserRolePermissionMappings();
