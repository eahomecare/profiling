const fs = require('fs');
const readline = require('readline');
const {
  PrismaClient,
} = require('@prisma/client');
const prisma = new PrismaClient();

const BACKUP_DIR = './backups/';

const extractModelNamesFromSchema = (
  schemaPath,
) => {
  const schema = fs.readFileSync(
    schemaPath,
    'utf8',
  );
  const models = [];
  const modelRegex = /^model (\w+) {/gm;
  let match;
  while (
    (match = modelRegex.exec(schema)) !== null
  ) {
    models.push(match[1]);
  }
  return models;
};

const getNextBackupIndex = (backupDate) => {
  let index = 1;
  while (
    fs.existsSync(
      `${BACKUP_DIR}${backupDate}_${index}/`,
    )
  ) {
    index++;
  }
  return index;
};

const backupModels = async (
  models,
  backupDir,
) => {
  let errors = [];
  for (let model of models) {
    console.log(`Backing up model: ${model}`);
    try {
      if (
        prisma[model] &&
        typeof prisma[model].findMany ===
          'function'
      ) {
        const data = await prisma[
          model
        ].findMany();
        const filePath = `${backupDir}${model}.json`;
        fs.writeFileSync(
          filePath,
          JSON.stringify(data, null, 2),
        );
      } else {
        errors.push(
          `Model ${model} doesn't exist or doesn't have a findMany method.`,
        );
      }
    } catch (err) {
      errors.push(
        `Error backing up model ${model}: ${err.message}`,
      );
    }
  }
  return errors;
};

const restoreModels = async (
  backupDate,
  backupIndex,
  models,
) => {
  let errors = [];
  const backupDir = `${BACKUP_DIR}${backupDate}_${backupIndex}/`;

  for (let model of models) {
    const filePath = `${backupDir}${model}.json`;
    if (!fs.existsSync(filePath)) {
      errors.push(
        `Backup for model ${model} does not exist on ${backupDate}_${backupIndex}`,
      );
      continue;
    }

    const data = JSON.parse(
      fs.readFileSync(filePath, 'utf8'),
    );

    try {
      if (
        prisma[model] &&
        typeof prisma[model].createMany ===
          'function'
      ) {
        await prisma[model].deleteMany();
        await prisma[model].createMany({ data });
      } else {
        errors.push(
          `Model ${model} doesn't exist or doesn't have a createMany method.`,
        );
      }
    } catch (err) {
      errors.push(
        `Error restoring model ${model}: ${err.message}`,
      );
    }
  }
  return errors;
};

const promptUser = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
};

const main = async () => {
  const currentSchemaPath =
    './prisma/schema.prisma';
  const currentDate = new Date()
    .toISOString()
    .split('T')[0];
  const backupIndex =
    getNextBackupIndex(currentDate);
  const currentBackupDir = `${BACKUP_DIR}${currentDate}_${backupIndex}/`;

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
  }

  if (!fs.existsSync(currentBackupDir)) {
    fs.mkdirSync(currentBackupDir);
  }

  const currentModels =
    extractModelNamesFromSchema(
      currentSchemaPath,
    );

  const option = await promptUser(
    'Do you want to (b)ackup or (r)estore? ',
  );

  if (option.toLowerCase() === 'b') {
    const errors = await backupModels(
      currentModels,
      currentBackupDir,
    );
    if (errors.length) {
      console.error(
        'Errors encountered during backup:',
      );
      errors.forEach((error) =>
        console.error(error),
      );
    } else {
      console.log(
        'Backup completed successfully.',
      );
    }
  } else if (option.toLowerCase() === 'r') {
    const backupDate = await promptUser(
      'Enter the date of the backup you want to restore (YYYY-MM-DD): ',
    );
    const backupIndex = await promptUser(
      'Enter the index of the backup for that day: ',
    );
    const errors = await restoreModels(
      backupDate,
      backupIndex,
      currentModels,
    );
    if (errors.length) {
      console.error(
        'Errors encountered during restore:',
      );
      errors.forEach((error) =>
        console.error(error),
      );
    } else {
      console.log(
        'Restore completed successfully.',
      );
    }
  } else {
    console.log('Invalid option.');
  }
};

main().catch((err) => {
  console.error(
    'An unexpected error occurred:',
    err,
  );
});
