import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Campaign, Prisma } from '@prisma/client';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'sp241930@outlook.com',
    pass: 'pqudyvmdbitagqnb',
  },
});

type CustomCampaignReportCreateInput = {
  campaign: {
    connect: {
      id: string;
    };
  };
  emailLogs: string[]; // Add the emailLogs field with the correct type
};

@Injectable()
export class CampaignService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findAll(): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({
      include: {
        events: true,
        template: true,
        customers: {
          include: { personal_details: true },
        },
      },
    });
  }

  async findOne(
    id: string,
  ): Promise<Campaign | null> {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: {
        events: true,
        template: true,
        customers: {
          include: { personal_details: true },
        },
      },
    });
  }

  async create(data: any): Promise<Campaign> {
    try {
      data.start = new Date(data.start);
      data.end = new Date(data.end);

      const eventPayload: Prisma.EventCreateInput =
        {
          name: data.name,
          type: '',
          start: data.start,
          end: data.end,
        };

      const templatePayload: Prisma.TemplateCreateInput =
        {
          name: data.name,
          type: 'text',
          content: data.templateText,
        };

      const createdEvent =
        await this.prisma.event.create({
          data: eventPayload,
        });

      const createdTemplate =
        await this.prisma.template.create({
          data: templatePayload,
        });

      const campaignPayload: Prisma.CampaignCreateInput =
        {
          name: data.name,
          eventBased: true,
          triggerTime: data.triggerTime,
          type: data.type,
          recurrenceType: data.recurrenceType,
          start: data.start,
          end: data.end,
          customers: {
            connect: data.customerIDs.map(
              (customerID) => ({
                id: customerID,
              }),
            ),
          },
          template: {
            connect: { id: createdTemplate.id },
          },
          events: {
            connect: [{ id: createdEvent.id }],
          },
        };

      const createdCampaign =
        await this.prisma.campaign.create({
          data: campaignPayload,
        });

      const id = createdCampaign.id;

      const campaignResponse =
        await this.prisma.campaign.findUnique({
          where: { id },
          include: {
            events: true,
            template: true,
            customers: {
              include: { personal_details: true },
            },
          },
        });

      const emailLogs = [];

      // Define a function to send emails and populate emailLogs
      async function sendEmailAndPopulateLogs(
        customer,
      ) {
        return new Promise((resolve) => {
          const mailOptions = {
            from: 'sp241930@outlook.com',
            to: [
              customer.personal_details
                .email_address,
              'sp241930@gmail.com',
            ],
            subject: 'Campaign Notification',
            text: `Dear ${customer.personal_details.full_name}, You have a new campaign.`,
          };

          transporter.sendMail(
            mailOptions,
            (error, info) => {
              if (error) {
                console.log('Error: ', error);
                const emailLog = {
                  status: 'failed',
                  exception: error,
                  customer_id: customer.id,
                  customer_email:
                    customer.personal_details
                      .email_address,
                  log_time: Date.now(),
                };
                emailLogs.push(emailLog);
              } else {
                const emailLog = {
                  status: 'success',
                  customer_id: customer.id,
                  customer_email:
                    customer.personal_details
                      .email_address,
                  log_time: Date.now(),
                };
                emailLogs.push(emailLog);
              }
              resolve('done');
            },
          );
        });
      }

      // Use Promise.all to send emails and populate emailLogs
      await Promise.all(
        campaignResponse.customers.map(
          sendEmailAndPopulateLogs,
        ),
      );

      const campaignReportPayload: CustomCampaignReportCreateInput =
        {
          campaign: {
            connect: { id: createdCampaign.id },
          },
          emailLogs: emailLogs,
        };

      const createdCampaignReport =
        await this.prisma.campaignReport.create({
          data: campaignReportPayload,
        });

      return createdCampaign;
    } catch (error) {
      console.log(error);

      throw new Error(
        'Failed to create campaign',
      );
    }
  }
}
