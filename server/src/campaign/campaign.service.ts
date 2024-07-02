import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Campaign, Prisma } from '@prisma/client';
import * as sendgrid from '@sendgrid/mail';

sendgrid.setApiKey('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');

type CustomCampaignReportCreateInput = {
  campaign: {
    connect: {
      id: string;
    };
  };
  emailLogs: string[];
};

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
      data.name = data.name.substring(0, 50);

      data.start = new Date(data.start);
      data.end = new Date(data.end);
      data.eventDate = data.eventDate
        ? new Date(data.eventDate)
        : null;

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
          description: data.description,
          eventDate: data.eventDate,
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

      if (
        data.keywordsUsed &&
        Array.isArray(data.keywordsUsed)
      ) {
        for (const keywordId of data.keywordsUsed) {
          const keywordExists =
            await this.prisma.keyword.findUnique({
              where: { id: keywordId },
            });

          if (!keywordExists) {
            throw new Error(
              `Keyword with ID ${keywordId} does not exist`,
            );
          }

          await this.prisma.campaignKeywordMapping.create(
            {
              data: {
                campaignId: createdCampaign.id,
                keywordId: keywordId,
              },
            },
          );
        }
      }

      const campaignResponse =
        await this.prisma.campaign.findUnique({
          where: { id: createdCampaign.id },
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
            from: 'support@eahomecare.in',
            to: customer.personal_details.email_address,
            cc: [
              'adaruwala@europ-assistance.in',
              'rpadave.extern@europ-assistance.in',
              'zmeghani.extern@europ-assistance.in',
              'spandey.extern@europ-assistance.in',
            ],
            subject: 'Campaign Notification',
            html: `<p>Dear ${customer.personal_details.full_name}, You have a new campaign.</p>`,
          };

          sendgrid.send(mailOptions)
            .then(() => {
              const emailLog = {
                status: 'success',
                customer_id: customer.id,
                customer_email: customer.personal_details.email_address,
                log_time: Date.now(),
              };
              emailLogs.push(emailLog);
              resolve('done');
            })
            .catch((error) => {
              console.log('Error: ', error);
              const emailLog = {
                status: 'failed',
                exception: error,
                customer_id: customer.id,
                customer_email: customer.personal_details.email_address,
                log_time: Date.now(),
              };
              emailLogs.push(emailLog);
              resolve('done');
            });
        });
      }

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
