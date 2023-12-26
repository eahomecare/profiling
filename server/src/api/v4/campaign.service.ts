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
    currentKeywords?: string[],
  ) {
    const keywordIds = new Set<string>();

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

    customerKeywords?.keywords.forEach((k) =>
      keywordIds.add(k.id),
    );

    if (
      currentKeywords &&
      currentKeywords.length > 0
    ) {
      for (const keywordId of currentKeywords) {
        const existingKeyword =
          await this.prisma.keyword.findUnique({
            where: { id: keywordId },
          });
        if (existingKeyword) {
          keywordIds.add(existingKeyword.id);
        }
      }
    }

    if (keywordIds.size === 0) {
      return [];
    }

    console.log(
      'keywordIds for campaign list',
      keywordIds,
    );

    const campaigns =
      await this.prisma.campaign.findMany({
        where: {
          keywords: {
            some: {
              keywordId: {
                in: [...keywordIds],
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

    console.log(
      'Campaigns found before date check',
      campaigns,
    );

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

    console.log(
      'Enhanced Campaigns found after date check',
      enhancedCampaigns,
    );

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
