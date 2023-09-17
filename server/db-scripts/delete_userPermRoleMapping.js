const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteUserRolePermissionMappings(userId) {
  try {
    // Find all userRolePermissionMapping records for the given userId
    const mappings = await prisma.userRolePermissionMapping.findMany({
      where: {
        userId: userId,
      },
    });

    // Delete all found mappings
    for (const mapping of mappings) {
      await prisma.userRolePermissionMapping.delete({
        where: {
          id: mapping.id,
        },
      });
    }

    console.log(`Deleted ${mappings.length} userRolePermissionMappings for user ID ${userId}`);
  } catch (error) {
    console.error('Error deleting userRolePermissionMappings:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

// Example usage:
const userIdToDeleteMappings = '650704dbce93f509e154b428'; // Replace with the user ID you want to delete mappings for
deleteUserRolePermissionMappings(userIdToDeleteMappings);
