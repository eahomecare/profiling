import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Campaign,
  Prisma,
  CampaignReport,
} from '@prisma/client';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'europeassistance@hotmail.com',
    pass: 'europe@2022',
  },
});

type CustomCampaignReportCreateInput = {
  campaign: {
    connect: {
      id: string;
    };
  };
  emailLogs: string[];
};

// custom-types.ts

// interface EmailLog {
//   status: string;
//   customer_id: string;
//   customer_email: string;
//   exception: string;
//   log_time: Date;
// }

interface EmailLog {
  status: string;
  exception?: {
    code: string;
    response: string;
    responseCode: number;
    command: string;
  };
  customer_id: string;
  customer_email: string;
  log_time: number;
}

function isEmailLog(log: any): log is EmailLog {
  return (
    log.status !== undefined &&
    log.customer_id !== undefined &&
    log.customer_email !== undefined &&
    log.log_time !== undefined
  );
}

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

      async function sendEmailAndPopulateLogs(
        customer,
      ) {
        return new Promise((resolve) => {
          const mailOptions = {
            from: 'europeassistance@hotmail.com',
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

  async getCampaignReports(): Promise<any[]> {
    try {
      const campaignReports =
        await this.prisma.campaignReport.findMany(
          {
            include: {
              campaign: true,
            },
          },
        );

      const modifiedCampaignReports =
        campaignReports.map((report) => {
          const totalSent =
            report.emailLogs.length;
          const success = report.emailLogs.filter(
            (log) =>
              isEmailLog(log) &&
              log.status === 'success',
          ).length;
          const failed = report.emailLogs.filter(
            (log) =>
              isEmailLog(log) &&
              log.status === 'failed',
          ).length;

          return {
            campaignid: report.campaign_id,
            campaignName: report.campaign.name,
            totalSent,
            success,
            failed,
          };
        });

      return modifiedCampaignReports;
    } catch (error) {
      console.error(
        'Error retrieving campaign reports:',
        error,
      );
      throw new Error(
        'Failed to retrieve campaign reports',
      );
    }
  }
}
