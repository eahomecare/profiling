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
                  created_at: { type: 'date' },
                  updated_at: { type: 'date' },
                },
              },
              info: {
                type: 'nested',
                properties: {
                  source: { type: 'keyword' },
                  created_at: { type: 'date' },
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
    const defaultDate = '2024-02-20T00:00:00Z';

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
            created_at: mapping.created_at
              ? mapping.created_at
              : defaultDate,
            updated_at: mapping.updated_at
              ? mapping.updated_at
              : defaultDate,
          }),
        ),
      info: {
        source: customerData.source,
        created_at: customerData.created_at
          ? customerData.created_at
          : defaultDate,
      },
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

      if (!profileType || profileType === 'all') {
        if (
          !demographic ||
          demographic === 'all'
        ) {
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
            const profileCount =
              esResponse.aggregations.profiles
                .filteredProfiles.profileCount
                .value;
            result[profileType] = profileCount;
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

  public async getWidget2Distribution(
    source: string,
    year?: number,
    month?: string,
  ): Promise<any[]> {
    this.logger.log(
      `Getting widget distribution for source: ${source}, year: ${year}, month: ${month}`,
    );

    const query = {
      bool: {
        must: [],
      },
    };

    if (source !== 'All') {
      query.bool.must.push({
        nested: {
          path: 'info',
          query: {
            match: { 'info.source': source },
          },
        },
      });
    }

    const dateHistogramAgg = {
      date_histogram: {
        field: 'info.created_at',
        calendar_interval: 'month',
        format: 'MMMM YYYY',
      },
    };

    if (year && month) {
      const monthNumber =
        parseInt(
          moment().month(month).format('M'),
          10,
        ) - 1;
      const startDate = moment({
        year,
        month: monthNumber,
        day: 1,
      }).toISOString();
      const endDate = moment(startDate)
        .endOf('month')
        .toISOString();

      query.bool.must.push({
        nested: {
          path: 'info',
          query: {
            range: {
              'info.created_at': {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      });

      dateHistogramAgg.date_histogram.calendar_interval =
        'day';
      dateHistogramAgg.date_histogram.format =
        'dd MMMM YYYY';
    } else if (year) {
      const startDate = moment({
        year,
        month: 0,
        day: 1,
      }).toISOString();
      const endDate = moment({
        year,
        month: 11,
        day: 31,
      }).toISOString();

      query.bool.must.push({
        nested: {
          path: 'info',
          query: {
            range: {
              'info.created_at': {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      });
    }

    try {
      const response =
        await this.elasticsearchService.search({
          index: indexName,
          size: 0,
          body: {
            query:
              query.bool.must.length > 0
                ? query
                : { match_all: {} },
            aggs: {
              nested_info: {
                nested: {
                  path: 'info',
                },
                aggs: {
                  time_buckets: dateHistogramAgg,
                },
              },
            },
          },
        });

      this.logger.debug(
        `Distribution response: ${JSON.stringify(
          response.body,
          null,
          2,
        )}`,
      );

      const buckets =
        response.body.aggregations.nested_info
          .time_buckets.buckets;

      this.logger.log(
        `Aggregations fetched successfully. Bucket size: ${buckets.length}`,
      );

      return buckets.map((bucket) => ({
        count: bucket.doc_count,
        label: bucket.key_as_string,
      }));
    } catch (error) {
      this.logger.error(
        `Error fetching widget2 distribution: ${error.message}`,
      );
      throw new Error(
        'Error fetching widget2 distribution',
      );
    }
  }

  public async getWidget2MenuItems(): Promise<{
    sources: string[];
    years: number[];
    months: string[];
  }> {
    try {
      const sourceResponse =
        await this.elasticsearchService.search({
          index: indexName,
          size: 0,
          body: {
            aggs: {
              nested_info: {
                nested: {
                  path: 'info',
                },
                aggs: {
                  sources: {
                    terms: {
                      field: 'info.source',
                    },
                  },
                },
              },
            },
          },
        });

      this.logger.debug(
        `Source aggregation response: ${JSON.stringify(
          sourceResponse.body,
          null,
          2,
        )}`,
      );

      const sourcesBuckets =
        sourceResponse.body.aggregations
          .nested_info.sources.buckets;
      const sources = [
        'All',
        ...sourcesBuckets.map(
          (bucket) => bucket.key,
        ),
      ];

      const yearResponse =
        await this.elasticsearchService.search({
          index: indexName,
          size: 0,
          body: {
            aggs: {
              nested_info: {
                nested: {
                  path: 'info',
                },
                aggs: {
                  years: {
                    date_histogram: {
                      field: 'info.created_at',
                      calendar_interval: 'year',
                      format: 'yyyy',
                    },
                  },
                },
              },
            },
          },
        });

      this.logger.debug(
        `Year aggregation response: ${JSON.stringify(
          yearResponse.body,
          null,
          2,
        )}`,
      );

      const yearsBuckets =
        yearResponse.body.aggregations.nested_info
          .years.buckets;
      const years = yearsBuckets.map((bucket) =>
        parseInt(bucket.key_as_string, 10),
      );

      const months = moment.months();

      this.logger.log(
        'Successfully fetched widget2 menu items',
      );
      return { sources, years, months };
    } catch (error) {
      this.logger.error(
        `Failed to fetch widget2 menu items: ${error.message}`,
      );
      throw new Error(
        'Error fetching widget2 menu items',
      );
    }
  }

  public async getWidget3Distribution(
    source: string,
    year?: number,
    month?: string,
  ): Promise<any[]> {
    this.logger.log(
      `Getting profile distribution for source: ${source}, year: ${year}, month: ${month}`,
    );

    const query: any = {
      bool: {
        must: [],
      },
    };

    if (source !== 'All') {
      query.bool.must.push({
        nested: {
          path: 'info',
          query: {
            term: { 'info.source': source },
          },
        },
      });
    }

    let dateFormat = 'MMMM YYYY';
    let calendarInterval = 'month';

    if (month) {
      dateFormat = 'dd MMMM YYYY';
      calendarInterval = 'day';
    }

    const dateHistogramAgg = {
      date_histogram: {
        field: 'profiles.updated_at',
        calendar_interval: calendarInterval,
        format: dateFormat,
      },
    };

    query.bool.must.push({
      nested: {
        path: 'profiles',
        query: {
          bool: {
            must: [
              {
                term: {
                  'profiles.isProfiled': true,
                },
              },
            ],
          },
        },
      },
    });

    const aggs = {
      profiles_nested: {
        nested: { path: 'profiles' },
        aggs: {
          profiled_profiles: {
            filter: {
              term: {
                'profiles.isProfiled': true,
              },
            },
            aggs: {
              updates_over_time: dateHistogramAgg,
            },
          },
        },
      },
    };

    try {
      const { body } =
        await this.elasticsearchService.search({
          index: indexName,
          size: 0,
          body: {
            query,
            aggs,
          },
        });

      const buckets =
        body.aggregations.profiles_nested
          .profiled_profiles.updates_over_time
          .buckets;

      this.logger.debug(
        `Profile distribution fetched: ${buckets.length} buckets`,
      );

      return buckets.map((bucket) => ({
        label: bucket.key_as_string,
        count: bucket.doc_count,
      }));
    } catch (error) {
      this.logger.error(
        `Error fetching profile distribution for Widget3: ${error.message}`,
      );
      throw new Error(
        'Failed to fetch profile distribution for Widget3',
      );
    }
  }

  public async getWidget3MenuItems(): Promise<{
    sources: string[];
    years: number[];
    months: string[];
  }> {
    this.logger.log(
      'Fetching widget3 menu items',
    );
    try {
      const sourceResponse =
        await this.elasticsearchService.search({
          index: indexName,
          size: 0,
          body: {
            aggs: {
              nested_info: {
                nested: {
                  path: 'info',
                },
                aggs: {
                  sources: {
                    terms: {
                      field: 'info.source',
                      size: 10,
                    },
                  },
                },
              },
            },
          },
        });

      const sources = [
        'All',
        ...sourceResponse.body.aggregations.nested_info.sources.buckets.map(
          (bucket) => bucket.key,
        ),
      ];

      const yearResponse =
        await this.elasticsearchService.search({
          index: indexName,
          size: 0,
          body: {
            aggs: {
              nested_profiles: {
                nested: {
                  path: 'profiles',
                },
                aggs: {
                  filtered_by_isProfiled: {
                    filter: {
                      term: {
                        'profiles.isProfiled':
                          true,
                      },
                    },
                    aggs: {
                      years: {
                        date_histogram: {
                          field:
                            'profiles.updated_at',
                          calendar_interval:
                            'year',
                          format: 'yyyy',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

      const years =
        yearResponse.body.aggregations.nested_profiles.filtered_by_isProfiled.years.buckets.map(
          (bucket) =>
            parseInt(bucket.key_as_string, 10),
        );

      const months = moment.months();

      this.logger.log(
        'Successfully fetched widget3 menu items',
      );
      return { sources, years, months };
    } catch (error) {
      this.logger.error(
        `Failed to fetch widget3 menu items: ${error.message}`,
      );
      throw new Error(
        'Error fetching widget3 menu items',
      );
    }
  }
}
