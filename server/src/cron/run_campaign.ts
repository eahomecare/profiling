import {
  PrismaClient,
  Campaign,
} from '@prisma/client';
import { Queue } from 'bullmq';
import cron from 'node-cron';

const prisma = new PrismaClient();
const queue = new Queue('campaign-queue');

// Inside the cron job or wherever you need to retrieve and schedule campaigns
cron.schedule('0 2 * * *', async () => {
  try {
    const currentTime = new Date();

    const activeCampaigns: Campaign[] =
      await prisma.campaign.findMany({
        where: {
          isActive: true,
          start: { lte: currentTime },
          end: { gte: currentTime },
        },
      });

    activeCampaigns.forEach(async (campaign) => {
      // Schedule task only if current time falls between start and end time
      if (campaign.triggerTime <= currentTime) {
        // Calculate the time difference in milliseconds until the triggerTime
        const timeDifference =
          campaign.triggerTime.getTime() -
          currentTime.getTime();

        // Schedule a task in the BullMQ queue to run at the triggerTime
        await queue.add(
          'campaign-task',
          campaign,
          {
            delay: timeDifference,
          },
        );
      }
    });
  } catch (error) {
    console.error(
      'Error fetching and scheduling campaigns:',
      error,
    );
  }
});
