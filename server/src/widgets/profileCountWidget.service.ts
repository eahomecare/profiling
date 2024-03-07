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
import moment from 'moment';

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
    const indexCreationResult =
      await this.initCustomerIndex();
    if (indexCreationResult) {
      await this.batchIndexExistingCustomers();
    }
  }

  private async initCustomerIndex() {
    try {
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
              age: { type: 'keyword' },
              profiles: {
                type: 'nested',
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
        return true; // Index was created
      } else {
        this.logger.log(
          `Index "${indexName}" already exists.`,
        );
        return false; // Index already exists
      }
    } catch (error) {
      this.logger.error(
        `Failed to initialize index "${indexName}": ${error.message}`,
      );
      return false;
    }
  }

  public async indexOrUpdateCustomerData(
    customerId: string,
  ) {
    try {
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
    } catch (error) {
      this.logger.error(
        `Error processing customer with ID: ${customerId} - ${error.message}`,
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

  public async batchIndexExistingCustomers() {
    this.logger.log(
      'Starting batch indexing of existing customers...',
    );
    let lastId = '';
    let hasMore = true;
    let count = 0;

    while (hasMore) {
      const customers =
        await this.prisma.customer.findMany({
          take: 1000,
          cursor: lastId
            ? { id: lastId }
            : undefined,
          skip: lastId ? 1 : 0,
          include: {
            personal_details: true,
            ProfileTypeCustomerMapping: {
              include: {
                profileType: true,
              },
            },
          },
        });

      if (customers.length) {
        const actions = customers.flatMap(
          (customer) => [
            {
              index: {
                _index: indexName,
                _id: customer.id,
              },
            },
            this.transformDataForElasticsearch(
              customer,
            ),
          ],
        );

        await this.elasticsearchService.bulk({
          refresh: true,
          body: actions,
        });
        lastId =
          customers[customers.length - 1].id;
        count += customers.length;
        this.logger.log(
          `Indexed ${count} customers so far...`,
        );
      } else {
        hasMore = false;
      }
    }

    this.logger.log(
      `Finished indexing ${count} existing customers.`,
    );
  }

  public async getCustomerDistribution(
    profileType = '',
    demographic = '',
  ): Promise<any> {
    this.logger.debug(
      'getCustomerDistribution called',
      { profileType, demographic },
    );

    try {
      let body;

      // When no profileType is selected, or it's for 'all'
      if (!profileType || profileType === 'all') {
        if (
          !demographic ||
          demographic === 'all'
        ) {
          this.logger.debug(
            'Aggregating counts by profile types',
          );
          body = {
            size: 0,
            aggs: {
              profileTypes: {
                nested: {
                  path: 'profiles',
                },
                aggs: {
                  names: {
                    terms: {
                      field:
                        'profiles.profileTypeName',
                    },
                  },
                },
              },
            },
          };
        } else {
          this.logger.debug(
            'Aggregating counts by demographic for all profile types',
          );
          body = {
            size: 0,
            aggs: {
              demographics: {
                terms: {
                  field: demographic,
                },
              },
            },
          };
        }
      } else {
        if (
          !demographic ||
          demographic === 'all'
        ) {
          this.logger.debug(
            `Counting customers profiled for ${profileType}`,
          );
          body = {
            query: {
              nested: {
                path: 'profiles',
                query: {
                  bool: {
                    must: [
                      {
                        match: {
                          'profiles.profileTypeName':
                            profileType,
                        },
                      },
                      {
                        match: {
                          'profiles.isProfiled':
                            true,
                        },
                      },
                    ],
                  },
                },
              },
            },
          };
        } else {
          this.logger.debug(
            `Aggregating counts by ${demographic} for ${profileType}`,
          );
          body = {
            size: 0,
            query: {
              nested: {
                path: 'profiles',
                query: {
                  bool: {
                    must: [
                      {
                        match: {
                          'profiles.profileTypeName':
                            profileType,
                        },
                      },
                      {
                        match: {
                          'profiles.isProfiled':
                            true,
                        },
                      },
                    ],
                  },
                },
              },
            },
            aggs: {
              demographics: {
                terms: {
                  field: demographic,
                },
              },
            },
          };
        }
      }

      this.logger.debug(
        'Elasticsearch query body prepared',
        { body },
      );

      const { body: esResponse } =
        await this.elasticsearchService.search({
          index: indexName,
          body,
        });

      this.logger.debug(
        'Elasticsearch response received',
        { esResponse },
      );

      // Parsing the Elasticsearch response to structure the aggregation results as desired
      let result = {};
      if (esResponse.aggregations) {
        this.logger.debug(
          'Processing Elasticsearch aggregations',
        );
        if (
          profileType === 'all' ||
          !profileType
        ) {
          if (
            demographic === 'all' ||
            !demographic
          ) {
            const profileBuckets =
              esResponse.aggregations.profileTypes
                .names.buckets;
            result = profileBuckets.reduce(
              (acc, bucket) => {
                acc[bucket.key] =
                  bucket.doc_count;
                return acc;
              },
              {},
            );
          } else {
            const demographicBuckets =
              esResponse.aggregations.demographics
                .buckets;
            result = demographicBuckets.reduce(
              (acc, bucket) => {
                acc[bucket.key] =
                  bucket.doc_count;
                return acc;
              },
              {},
            );
          }
        } else {
          if (
            demographic === 'all' ||
            !demographic
          ) {
            result[profileType] =
              esResponse.aggregations.doc_count;
          } else {
            const demographicBuckets =
              esResponse.aggregations.demographics
                .buckets;
            result = demographicBuckets.reduce(
              (acc, bucket) => {
                acc[bucket.key] =
                  bucket.doc_count;
                return acc;
              },
              {},
            );
          }
        }
        this.logger.debug('Aggregation result', {
          result,
        });
      }

      return result;
    } catch (error) {
      this.logger.error(
        'Failed to execute aggregation query',
        { errorMessage: error.message },
      );
      throw new Error(
        'Aggregation query execution failed',
      );
    }
  }

  public async getFirstMenuItems(): Promise<
    string[]
  > {
    try {
      const { body } =
        await this.elasticsearchService.search({
          index: indexName,
          size: 1,
          _source: ['profiles.profileTypeName'],
        });

      if (body.hits.hits.length > 0) {
        const profiles =
          body.hits.hits[0]._source.profiles;

        const uniqueProfileTypes = [
          ...new Set(
            profiles.map(
              (profile) =>
                profile.profileTypeName,
            ),
          ),
        ] as string[];

        this.logger.log(
          'First menu items fetched successfully based on the first document.',
        );
        return ['All', ...uniqueProfileTypes];
      } else {
        this.logger.log(
          'No documents found in the index.',
        );
        return ['All'];
      }
    } catch (error) {
      this.logger.error(
        `Failed to fetch first menu items: ${error.message}`,
      );
      throw new Error(
        'Fetching first menu items failed',
      );
    }
  }

  public async getSecondMenuItems(): Promise<
    string[]
  > {
    // The logic for dynamically fetching fields from the index mapping, excluding nested fields
    try {
      const { body } =
        await this.elasticsearchService.indices.getMapping(
          { index: indexName },
        );
      const mappings =
        body[indexName].mappings.properties;
      const menuItems = Object.keys(
        mappings,
      ).filter(
        (key) => mappings[key].type !== 'nested',
      );

      this.logger.log(
        'Second menu items fetched successfully.',
      );
      return ['all', ...menuItems];
    } catch (error) {
      this.logger.error(
        'Failed to fetch second menu items: ' +
          error.message,
      );
      throw new Error(
        'Fetching second menu items failed',
      );
    }
  }
}
