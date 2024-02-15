import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProfileService } from 'src/profile/profile.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerElasticService
  implements OnModuleInit
{
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ProfileService))
    private readonly profileService: ProfileService,
  ) {}

  async onModuleInit() {
    await this.initCustomerIndex();
  }

  private async initCustomerIndex() {
    const indexName = 'customertable';
    try {
      const indexExists =
        await this.elasticsearchService.indices.exists(
          { index: indexName },
        );
      if (!indexExists.body) {
        await this.createCustomerIndex(indexName);
        await this.indexExistingCustomers(
          indexName,
        );
      }
    } catch (error) {
      console.error(
        `Failed to initialize customer index: ${error.message}`,
      );
    }
  }

  private async createCustomerIndex(
    indexName: string,
  ) {
    try {
      await this.elasticsearchService.indices.create(
        {
          index: indexName,
          body: {
            settings: {
              analysis: {
                filter: {
                  edge_ngram_filter: {
                    type: 'edge_ngram',
                    min_gram: 1,
                    max_gram: 20,
                  },
                },
                analyzer: {
                  edge_ngram_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: [
                      'lowercase',
                      'edge_ngram_filter',
                    ],
                  },
                },
              },
            },
            mappings: {
              properties: {
                name: {
                  type: 'text',
                  analyzer: 'edge_ngram_analyzer',
                  search_analyzer: 'standard',
                },
                customerId: { type: 'keyword' },
                email: {
                  type: 'text',
                  analyzer: 'edge_ngram_analyzer',
                  search_analyzer: 'standard',
                },
                source: {
                  type: 'text',
                  analyzer: 'edge_ngram_analyzer',
                  search_analyzer: 'standard',
                },
                mobile: {
                  type: 'text',
                  analyzer: 'edge_ngram_analyzer',
                  search_analyzer: 'standard',
                },
                profile_percentage: {
                  type: 'integer',
                },
                createdDate: { type: 'date' },
              },
            },
          },
        },
      );
    } catch (error) {
      console.error(
        `Failed to create customer index: ${error.message}`,
      );
    }
  }

  private async indexExistingCustomers(
    indexName: string,
  ) {
    try {
      const customers =
        await this.prisma.customer.findMany();
      for (const customer of customers) {
        await this.profileService.calculateAndSaveProfileCompletion(
          customer.id,
        );
        await this.indexOrUpdateCustomer(
          indexName,
          customer.id,
        );
      }
    } catch (error) {
      console.error(
        `Failed to index existing customers: ${error.message}`,
      );
    }
  }

  public async indexOrUpdateCustomer(
    indexName: string,
    customerId: string,
  ) {
    try {
      const customer =
        await this.prisma.customer.findUnique({
          where: { id: customerId },
          include: {
            personal_details: true,
          },
        });

      if (!customer) {
        console.error(
          `Customer not found with ID: ${customerId}`,
        );
        return;
      }

      await this.elasticsearchService.index({
        index: indexName,
        id: customer.id,
        body: {
          name:
            customer.personal_details
              ?.full_name || '',
          customerId: customer.id,
          email: customer.email || '',
          source: customer.source || '',
          mobile: customer.mobile || '',
          profile_percentage:
            customer.profile_percentage || 0,
          createdDate: customer.created_at,
        },
      });
    } catch (error) {
      console.error(
        `Failed to index or update customer: ${error.message}`,
      );
    }
  }

  public async globalSearch(
    indexName: string,
    searchTerm: string,
    from = 0,
    size = 10,
  ) {
    try {
      const response =
        await this.elasticsearchService.search({
          index: indexName,
          from,
          size,
          body: {
            query: {
              multi_match: {
                query: searchTerm,
                fields: [
                  'name',
                  'email',
                  'source',
                  'mobile',
                ],
              },
            },
            sort: [
              { createdDate: { order: 'desc' } },
            ],
          },
        });
      return response;
    } catch (error) {
      console.error(
        `Global search error: ${error.message}`,
      );
      throw new Error(
        'Error executing global search',
      );
    }
  }

  public async columnSearch(
    indexName: string,
    field: string,
    searchTerm: string,
    from = 0,
    size = 10,
  ) {
    try {
      // Ensure the field is one of the autocomplete-enabled fields
      if (
        ![
          'name',
          'email',
          'source',
          'mobile',
        ].includes(field)
      ) {
        throw new Error(
          `Invalid search field: ${field}`,
        );
      }

      const response =
        await this.elasticsearchService.search({
          index: indexName,
          from,
          size,
          body: {
            query: {
              match: {
                [field]: {
                  query: searchTerm,
                  operator: 'and',
                },
              },
            },
            sort: [
              { createdDate: { order: 'desc' } },
            ],
          },
        });
      return response;
    } catch (error) {
      console.error(
        `Column search error: ${error.message}`,
      );
      throw new Error(
        'Error executing column search',
      );
    }
  }

  public async compoundSearch(
    indexName: string,
    searchTerms: { [key: string]: string },
    from = 0,
    size = 10,
  ) {
    try {
      const mustQueries = Object.keys(
        searchTerms,
      ).map((field) => {
        // Ensure only searchable fields are included
        if (
          ![
            'name',
            'email',
            'source',
            'mobile',
          ].includes(field)
        ) {
          throw new Error(
            `Invalid search field: ${field}`,
          );
        }
        return {
          match: {
            [field]: {
              query: searchTerms[field],
              operator: 'and',
            },
          },
        };
      });

      const response =
        await this.elasticsearchService.search({
          index: indexName,
          from,
          size,
          body: {
            query: {
              bool: {
                must: mustQueries,
              },
            },
            sort: [
              { createdDate: { order: 'desc' } },
            ],
          },
        });
      return response;
    } catch (error) {
      console.error(
        `Compound search error: ${error.message}`,
      );
      throw new Error(
        'Error executing compound search',
      );
    }
  }

  public async fetchPaginatedResults(
    indexName: string,
    from = 0,
    size = 10,
  ) {
    try {
      const response =
        await this.elasticsearchService.search({
          index: indexName,
          from,
          size,
          body: {
            query: {
              match_all: {},
            },
            sort: [
              { createdDate: { order: 'desc' } },
            ],
          },
        });
      return response;
    } catch (error) {
      console.error(
        `Fetch paginated results error: ${error.message}`,
      );
      throw new Error(
        'Error fetching paginated results',
      );
    }
  }
}
