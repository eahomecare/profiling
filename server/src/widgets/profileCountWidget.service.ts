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
          {
            index: indexName,
          },
        );
      if (!indexExists.body) {
        this.logger.log(
          `Index "${indexName}" does not exist. Creating it...`,
        );
        const body = {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
            index: {
              max_result_window: 100000000,
            },
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
          {
            index: indexName,
            body,
          },
        );
        this.logger.log(
          `Index "${indexName}" created successfully.`,
        );
        return true;
      } else {
        this.logger.log(
          `Index "${indexName}" already exists.`,
        );
        return false;
      }
    } catch (error) {
      this.logger.error(
        `Failed to initialize index "${indexName}": ${error.message}`,
      );
      return false;
    }
  }

  public async indexOrUpdateCustomerDataProfileCountWidget(
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

      // When no profileType or it's 'all'
      if (!profileType || profileType === 'all') {
        if (
          !demographic ||
          demographic === 'all'
        ) {
          // Aggregating counts by profile types where isProfiled is true
          body = {
            size: 0,
            track_total_hits: true,
            aggs: {
              profiles: {
                nested: {
                  path: 'profiles',
                },
                aggs: {
                  profiled: {
                    filter: {
                      term: {
                        'profiles.isProfiled':
                          true,
                      },
                    },
                    aggs: {
                      profileType: {
                        terms: {
                          field:
                            'profiles.profileTypeName',
                        },
                        aggs: {
                          profileCount: {
                            value_count: {
                              field:
                                'profiles.isProfiled',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          };
        } else {
          // Aggregating counts by demographic for all profile types
          this.logger.debug(
            'Aggregating counts by demographic for all profile types',
          );
          body = {
            size: 0,
            track_total_hits: true,
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
          // When a specific profileType but no demographic is selected
          body = {
            size: 0,
            track_total_hits: true,
            query: {
              nested: {
                path: 'profiles',
                query: {
                  bool: {
                    must: [
                      {
                        term: {
                          'profiles.profileTypeName':
                            profileType,
                        },
                      },
                      {
                        term: {
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
              profiles: {
                nested: {
                  path: 'profiles',
                },
                aggs: {
                  filteredProfiles: {
                    filter: {
                      bool: {
                        must: [
                          {
                            term: {
                              'profiles.profileTypeName':
                                profileType,
                            },
                          },
                          {
                            term: {
                              'profiles.isProfiled':
                                true,
                            },
                          },
                        ],
                      },
                    },
                    aggs: {
                      profileCount: {
                        value_count: {
                          field:
                            'profiles.isProfiled',
                        },
                      },
                    },
                  },
                },
              },
            },
          };
        } else {
          // Aggregating counts by demographic for a specific profileType
          this.logger.debug(
            `Aggregating counts by ${demographic} for ${profileType}`,
          );
          body = {
            size: 0,
            track_total_hits: true,
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
                        term: {
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

      let result = {};
      if (esResponse.aggregations) {
        this.logger.debug(
          'Processing Elasticsearch aggregations',
        );

        if (
          !profileType ||
          profileType === 'all'
        ) {
          if (
            !demographic ||
            demographic === 'all'
          ) {
            const profileBuckets =
              esResponse.aggregations.profiles
                .profiled.profileType.buckets;
            result = profileBuckets.reduce(
              (acc, bucket) => {
                acc[bucket.key] =
                  bucket.profileCount.value;
                return acc;
              },
              {},
            );
          } else {
            // Process aggregation result for demographic across all profile types
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
            !demographic ||
            demographic === 'all'
          ) {
            // Process result for a specific profileType without demographic
            const profileCount =
              esResponse.aggregations.profiles
                .filteredProfiles.profileCount
                .value;
            result[profileType] = profileCount;
          } else {
            // Process aggregation result for both profileType and demographic specified
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
          track_total_hits: true,
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
