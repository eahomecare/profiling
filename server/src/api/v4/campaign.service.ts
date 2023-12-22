import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CampaignDto } from './dto/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async getCampaignsForCustomer(
    customerId: string,
  ) {
    const customerKeywords =
      await this.prisma.customer.findUnique({
        where: { id: customerId },
        select: {
          keywords: {
            select: {
              id: true,
            },
          },
        },
      });

    if (
      !customerKeywords ||
      customerKeywords.keywords.length === 0
    ) {
      return [];
    }

    const keywordIds =
      customerKeywords.keywords.map((k) => k.id);

    const campaigns =
      await this.prisma.campaign.findMany({
        where: {
          keywords: {
            some: {
              keywordId: {
                in: keywordIds,
              },
            },
          },
        },
        take: 10,
        orderBy: {
          keywords: {
            _count: 'desc',
          },
        },
        include: {
          keywords: true,
        },
      });

    const today = new Date();

    const enhancedCampaigns = campaigns
      .filter(
        (campaign) =>
          new Date(campaign.end) >= today,
      )
      .map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        date: campaign.end,
        modes: [campaign.type],
        included:
          campaign.customerIDs.includes(
            customerId,
          ),
      }));

    return enhancedCampaigns;
  }

  async handleCampaign(
    customerId: string,
    campaignData: CampaignDto,
  ) {
    let campaign;
    try {
      campaign =
        await this.prisma.campaign.findUnique({
          where: { id: campaignData.campaignId },
        });

      const isCustomerIncluded =
        campaign.customerIDs.includes(customerId);

      if (!isCustomerIncluded) {
        await this.prisma.campaign.update({
          where: { id: campaignData.campaignId },
          data: {
            customerIDs: {
              push: customerId,
            },
          },
        });
      }

      const modeStatuses =
        await this.simulateModeSendings(
          customerId,
          campaignData.modes,
        );

      return {
        message: 'Campaign handled successfully',
        modeStatuses,
      };
    } catch (error) {
      console.error(
        'Error in handleCampaign:',
        error,
      );

      if (!campaign) {
        throw new NotFoundException(
          'Campaign not found',
        );
      }

      throw new HttpException(
        'Error processing campaign',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async simulateModeSendings(
    customerId: string,
    modes: ('WHATSAPP' | 'EMAIL' | 'SMS')[],
  ) {
    const modeStatuses = {};
    for (const mode of modes) {
      modeStatuses[
        mode
      ] = `${mode} sent successfully`;
    }
    return modeStatuses;
  }
}
