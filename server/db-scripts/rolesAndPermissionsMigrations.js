const {
  PrismaClient,
} = require('@prisma/client');

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

const roleNames = [
  'admin',
  'agent',
  'campaign_manager',
  'team_lead',
  'qc',
];

const permissionNames = [
  'customer_dashboard',
  'profile_dashboard',
  'campaign_dashoard',
  'user_create',
  'user_view',
  'user_read',
  'user_delete',
  'user_edit',
  'customer_details',
  'acl',
  'keywords_view',
  'keywords_edit',
];

let roleIdMap = {};
let permissionIdMap = {};

async function createRoles() {
  for (const roleName of roleNames) {
    const existingRole =
      await prismaDestination.role.findFirst({
        where: { name: roleName },
      });
    if (!existingRole) {
      const role =
        await prismaDestination.role.create({
          data: { name: roleName },
        });
      roleIdMap[roleName] = role.id;
      console.log(
        `Role '${roleName}' created successfully with ID ${role.id}.`,
      );
    } else {
      roleIdMap[roleName] = existingRole.id;
      console.log(
        `Role '${roleName}' already exists with ID ${existingRole.id}.`,
      );
    }
  }
}

async function createPermissions() {
  for (const permissionName of permissionNames) {
    const existingPermission =
      await prismaDestination.permission.findFirst(
        { where: { name: permissionName } },
      );
    if (!existingPermission) {
      const permission =
        await prismaDestination.permission.create(
          {
            data: { name: permissionName },
          },
        );
      permissionIdMap[permissionName] =
        permission.id;
      console.log(
        `Permission '${permissionName}' created successfully with ID ${permission.id}.`,
      );
    } else {
      permissionIdMap[permissionName] =
        existingPermission.id;
      console.log(
        `Permission '${permissionName}' already exists with ID ${existingPermission.id}.`,
      );
    }
  }
}

async function linkRolesAndPermissions() {
  const roles = await prismaSource.role.findMany({
    include: {
      defaultPermissions: true,
    },
  });

  for (const role of roles) {
    const permissionsToConnect =
      role.defaultPermissions.map(
        (permission) => ({
          id: permissionIdMap[permission.name],
        }),
      );

    await prismaDestination.role.update({
      where: { id: roleIdMap[role.name] },
      data: {
        defaultPermissions: {
          connect: permissionsToConnect,
        },
      },
    });
  }
  console.log(
    'Roles and permissions linked successfully.',
  );
}

async function transferUserAndMappings() {
  const userEmail = 'homecare@ea.in';
  const user = await prismaSource.user.findUnique(
    {
      where: { email: userEmail },
      include: {
        userRolePermissionMapping: true,
      },
    },
  );

  if (user) {
    const existingUser =
      await prismaDestination.user.findUnique({
        where: { email: userEmail },
      });
    if (!existingUser) {
      const newUser =
        await prismaDestination.user.create({
          data: {
            email: user.email,
            fullname: user.fullname,
            agentID: user.agentID,
            agentJWT: user.agentJWT,
          },
        });

      for (const mapping of user.userRolePermissionMapping) {
        await prismaDestination.userRolePermissionMapping.create(
          {
            data: {
              user: {
                connect: { id: newUser.id },
              },
              role: {
                connect: { id: mapping.roleId },
              },
              permission: {
                connect: {
                  id: mapping.permissionId,
                },
              },
            },
          },
        );
      }
      console.log(
        `User '${userEmail}' and their mappings transferred successfully.`,
      );
    } else {
      console.log(
        `User '${userEmail}' already exists.`,
      );
    }
  } else {
    console.log(
      `User '${userEmail}' not found in source.`,
    );
  }
}

async function verifyMigration() {
  const sourceRolesCount =
    await prismaSource.role.count();
  const destinationRolesCount =
    await prismaDestination.role.count();
  console.log(
    `Roles in source: ${sourceRolesCount}, Roles in destination: ${destinationRolesCount}`,
  );

  // Add more verification logic as needed
}

async function examine(dbClient, modelName) {
  const data = await dbClient[modelName].findMany(
    {
      include: {
        _count: true,
      },
    },
  );
  console.log(
    `Data structure for ${modelName}:`,
    JSON.stringify(data, null, 2),
  );
}

async function main() {
  try {
    console.log('Creating roles...');
    await createRoles();
    console.log('Creating permissions...');
    await createPermissions();
    console.log(
      'Linking roles and permissions...',
    );
    await linkRolesAndPermissions();
    console.log(
      'Transferring specific user and their mappings...',
    );
    await transferUserAndMappings();
    console.log('Verifying migration...');
    await verifyMigration();
    console.log(
      'Migration completed successfully.',
    );
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prismaSource.$disconnect();
    await prismaDestination.$disconnect();
  }
}

main();
