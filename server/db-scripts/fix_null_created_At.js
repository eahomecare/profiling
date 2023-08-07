const {
  PrismaClient,
  dmmf,
} = require('@prisma/client');

const prisma = new PrismaClient();

async function updateCreatedAtForModel(
  modelName,
) {
  try {
    const model = dmmf.datamodel.models.find(
      (m) => m.name === modelName,
    );

    if (
      model &&
      model.fields.find(
        (f) => f.name === 'created_at',
      )
    ) {
      const updateResult = await prisma[
        modelName
      ].updateMany({
        where: {
          created_at: undefined,
        },
        data: {
          created_at: new Date(),
        },
      });

      console.log(
        `Updated ${updateResult.count} records in ${modelName}`,
      );
    } else {
      console.log(
        `Skipping ${modelName} because it does not have a 'created_at' field.`,
      );
    }
  } catch (error) {
    console.error(
      `Error updating records for ${modelName}:`,
      error,
    );
  }
}

async function updateCreatedAtForAllModels() {
  try {
    const modelNames = dmmf.datamodel.models;

    for (const modelName of modelNames) {
      await updateCreatedAtForModel(
        modelName.name,
      );
    }
  } catch (error) {
    console.error(
      'Error fetching model names:',
      error,
    );
  }
}

async function main() {
  await updateCreatedAtForAllModels();
}

main()
  .catch((error) => {
    console.error('Error:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
