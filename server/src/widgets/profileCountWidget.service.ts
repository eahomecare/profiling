import {
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from '../prisma/prisma.service';
import {
  mappings,
  indexName,
} from './profileCountWidgetMappings';
import * as moment from 'moment';

@Injectable()
export class ProfileCountWidgetService
  implements OnModuleInit
{
  private readonly logger = new Logger(
    ProfileCountWidgetService.name,
  );

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    await this.initCustomerIndex();
    await this.batchIndexExistingCustomers();
  }

  private async initCustomerIndex() {
    const indexExists =
      await this.elasticsearchService.indices.exists(
        { index: indexName },
      );
    if (!indexExists.body) {
      this.logger.log(
        `Index "${indexName}" does not exist. Creating it...`,
      );
      const body = {
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0,
        },
        mappings: {
          properties: {
            gender: { type: 'keyword' },
            age: { type: 'keyword' }, // Age is transformed into a range string, hence 'keyword'
            profiles: {
              type: 'nested', // For nested objects like profileMapping
              properties: {
                profileTypeName: {
                  type: 'keyword',
                },
                isProfiled: { type: 'boolean' },
              },
            },
          },
        },
      };
      await this.elasticsearchService.indices.create(
        { index: indexName, body },
      );
      this.logger.log(
        `Index "${indexName}" created successfully.`,
      );
    } else {
      this.logger.log(
        `Index "${indexName}" already exists.`,
      );
    }
  }

  public async indexOrUpdateCustomerData(
    customerId: string,
  ) {
    const customerData =
      await this.fetchAndTransformCustomerData(
        customerId,
      );
    if (customerData) {
      await this.elasticsearchService.index({
        index: indexName,
        id: customerId,
        body: customerData,
      });
      this.logger.log(
        `Customer with ID: ${customerId} indexed/updated successfully.`,
      );
    } else {
      this.logger.warn(
        `Customer with ID: ${customerId} not found.`,
      );
    }
  }

  private async fetchAndTransformCustomerData(
    customerId: string,
  ) {
    const customer =
      await this.prisma.customer.findUnique({
        where: { id: customerId },
        include: {
          personal_details: true,
          ProfileTypeCustomerMapping: {
            include: {
              profileType: true,
            },
          },
        },
      });

    if (!customer) return null;

    return this.transformDataForElasticsearch(
      customer,
    );
  }

  private transformDataForElasticsearch(
    customerData: any,
  ): any {
    const transformed = {
      gender:
        customerData.personal_details?.gender,
      age: this.calculateAge(
        customerData.personal_details
          ?.date_of_birth,
      ),
      profiles:
        customerData.ProfileTypeCustomerMapping.map(
          (mapping) => ({
            profileTypeName:
              mapping.profileType.name,
            isProfiled: mapping.level > 1,
          }),
        ),
    };
    return transformed;
  }

  private calculateAge(
    dateOfBirth: string,
  ): string {
    if (!dateOfBirth) return 'unknown';
    const age = moment().diff(
      moment(dateOfBirth, 'YYYY-MM-DD'),
      'years',
    );
    return mappings
      .find((m) => m.name === 'age')
      .ranges.reduce((acc, curr, index, src) => {
        if (age >= curr && age < src[index + 1])
          acc = `${curr}-${src[index + 1]}`;
        return acc;
      }, `above-${mappings.find((m) => m.name === 'age').ranges.slice(-1)[0]}`);
  }

  private async batchIndexExistingCustomers() {
    let lastId = ''; // MongoDB ObjectId starts with a timestamp, this will get the first in the collection
    let hasMore = true;

    while (hasMore) {
      const customers =
        await this.prisma.customer.findMany({
          take: 100,
          where: lastId
            ? { id: { gt: lastId } }
            : undefined,
          include: {
            personal_details: true,
            ProfileTypeCustomerMapping: {
              include: {
                profileType: true,
              },
            },
          },
        });

      if (customers.length === 0) {
        hasMore = false;
      } else {
        const actions = customers
          .map((customer) => [
            {
              index: {
                _index: indexName,
                _id: customer.id,
              },
            },
            this.transformDataForElasticsearch(
              customer,
            ),
          ])
          .flat();

        await this.elasticsearchService.bulk({
          refresh: true,
          body: actions,
        });

        lastId =
          customers[customers.length - 1].id;
      }
    }

    this.logger.log(
      'Completed indexing existing customers.',
    );
  }
}
