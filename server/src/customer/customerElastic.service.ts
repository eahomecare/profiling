import {
  forwardRef,
  Inject,
  Injectable,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProfileService } from 'src/profile/profile.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerElasticService
  implements OnModuleInit
{
  private readonly logger = new Logger(
    CustomerElasticService.name,
  );

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly prisma: PrismaService,
    private readonly profileService: ProfileService,
  ) {
    this.logger.log(
      'CustomerElasticService instantiated',
    );
  }

  async onModuleInit() {
    this.logger.log(
      'Initializing CustomerElasticService module...',
    );
    await this.initCustomerIndex();
  }

  private async initCustomerIndex() {
    const indexName = 'customertable';
    try {
      this.logger.log(
        `Checking if index "${indexName}" exists...`,
      );
      const indexExists =
        await this.elasticsearchService.indices.exists(
          { index: indexName },
        );
      if (!indexExists.body) {
        this.logger.log(
          `Index "${indexName}" does not exist. Creating it...`,
        );
        await this.createCustomerIndex(indexName);
        await this.indexExistingCustomers(
          indexName,
        );
      } else {
        this.logger.log(
          `Index "${indexName}" already exists.`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to initialize customer index: ${error.message}`,
      );
    }
  }

  private async createCustomerIndex(
    indexName: string,
  ) {
    try {
      this.logger.log(
        `Creating index "${indexName}"...`,
      );
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
      this.logger.log(
        `Index "${indexName}" created successfully.`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to create customer index: ${error.message}`,
      );
    }
  }

  private async indexExistingCustomers(
    indexName: string,
  ) {
    this.logger.log(
      'Indexing existing customers...',
    );
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
      this.logger.log(
        'Existing customers indexed successfully.',
      );
    } catch (error) {
      this.logger.error(
        `Failed to index existing customers: ${error.message}`,
      );
    }
  }

  public async indexOrUpdateCustomer(
    indexName: string,
    customerId: string,
  ) {
    this.logger.log(
      `Indexing or updating customer with ID: ${customerId}`,
    );
    try {
      const customer =
        await this.prisma.customer.findUnique({
          where: { id: customerId },
          include: {
            personal_details: true,
          },
        });

      if (!customer) {
        this.logger.error(
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
      this.logger.log(
        `Customer with ID: ${customerId} indexed/updated successfully.`,
      );
    } catch (error) {
      this.logger.error(
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
    this.logger.log(
      `Performing global search for term: "${searchTerm}"...`,
    );
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
      this.logger.log(
        'Global search executed successfully.',
      );
      return response;
    } catch (error) {
      this.logger.error(
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
    this.logger.log(
      `Performing column search for term: "${searchTerm}" in field: "${field}"...`,
    );
    try {
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
      this.logger.log(
        'Column search executed successfully.',
      );
      return response;
    } catch (error) {
      this.logger.error(
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
    this.logger.log(
      'Performing compound search with multiple terms...',
    );
    try {
      const mustQueries = Object.keys(
        searchTerms,
      ).map((field) => {
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
      this.logger.log(
        'Compound search executed successfully.',
      );
      return response;
    } catch (error) {
      this.logger.error(
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
    this.logger.log(
      'Fetching paginated results...',
    );
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
      this.logger.log(
        'Paginated results fetched successfully.',
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Fetch paginated results error: ${error.message}`,
      );
      throw new Error(
        'Error fetching paginated results',
      );
    }
  }
}
