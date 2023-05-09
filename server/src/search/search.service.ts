import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
    constructor(private readonly elasticsearchService: ElasticsearchService) { }

    async onModuleInit() {
        const index = 'your_index_name';
        const indexExists = await this.checkIfIndexExists(index);

        if (!indexExists) {
            await this.createAutocompleteIndex(index);
        }
    }

    async checkIfIndexExists(index: string): Promise<boolean> {
        const response = await this.elasticsearchService.indices.exists({ index });
        return response.body;
    }

    async createAutocompleteIndex(index: string) {
        return await this.elasticsearchService.indices.create({
            index,
            body: {
                mappings: {
                    properties: {
                        id: {
                            type: 'keyword',
                        },
                        label: {
                            type: 'completion',
                        },
                    },
                },
            },
        });
    }

    async insertData(index: string, id: string, label: string) {
        return await this.elasticsearchService.index({
            index,
            id,
            body: {
                id,
                label,
            },
        });
    }

    async insertBulkData(index: string, data: Array<{ id: string; label: string }>) {
        const body = data.flatMap(item => [
            { index: { _index: index, _id: item.id } },
            { id: item.id, label: item.label },
        ]);

        return await this.elasticsearchService.bulk({ refresh: true, body });
    }

    async suggestLabels(index: string, prefix: string) {
        const response = await this.elasticsearchService.search({
            index,
            body: {
                suggest: {
                    label_suggestion: {
                        prefix,
                        completion: {
                            field: 'label',
                        },
                    },
                },
            },
        });

        const suggestions = response.body.suggest.label_suggestion[0].options.map(option => ({
            value: option._source.id,
            label: option._source.label,
        }));

        return suggestions;
    }


    async create(index: string, id: string, body: Record<string, any>) {
        return await this.elasticsearchService.index({
            index,
            id,
            body,
        });
    }

    async search(index: string, query: string) {
        return await this.elasticsearchService.search({
            index,
            body: {
                query: {
                    match: {
                        message: query,
                    },
                },
            },
        });
    }

    async getById(index: string, id: string) {
        return await this.elasticsearchService.get({ index, id });
    }

    async update(index: string, id: string, body: Record<string, any>) {
        return await this.elasticsearchService.update({
            index,
            id,
            body: {
                doc: body,
            },
        });
    }

    async delete(index: string, id: string) {
        return await this.elasticsearchService.delete({ index, id });
    }

    async deleteIndex(index: string) {
        return await this.elasticsearchService.indices.delete({ index });
    }
}