import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
    constructor(private readonly elasticsearchService: ElasticsearchService) { }

    async onModuleInit() {
        try {
            const index = 'keywords';
            const indexExists = await this.checkIfIndexExists(index);

            if (!indexExists) {
                await this.createAutocompleteIndex(index);
            }
        } catch (error) {
            console.error('Error during module initialization:', error);
        }
    }

    async checkIfIndexExists(index: string): Promise<boolean> {
        try {
            const response = await this.elasticsearchService.indices.exists({ index });
            return response.body;
        } catch (error) {
            console.error('Error checking index existence:', error);
            return false;
        }
    }

    async createAutocompleteIndex(index: string) {
        try {
            return await this.elasticsearchService.indices.create({
                index,
                body: {
                    mappings: {
                        properties: {
                            id: {
                                type: 'keyword',
                            },
                            category: {
                                type: 'text',
                                fields: {
                                    suggest: {
                                        type: 'completion'
                                    }
                                }
                            },
                            value: {
                                type: 'text',
                                fields: {
                                    suggest: {
                                        type: 'completion'
                                    }
                                }
                            },
                            level: {
                                type: 'integer',
                            },
                        },
                    },
                },
            });
        } catch (error) {
            console.error('Error creating autocomplete index:', error);
            throw error;
        }
    }

    async autocomplete(index: string, term: string, field: 'category' | 'value' | 'both' = 'value') {
        let suggestField;

        switch (field) {
            case 'category':
                suggestField = 'category_suggest';
                break;
            case 'value':
                suggestField = 'value_suggest';
                break;
            case 'both':
                return await this.autocompleteBothFields(index, term);
            default:
                suggestField = 'value_suggest';
                break;
        }

        try {
            const response = await this.elasticsearchService.search({
                index,
                _source: ["category", "value", "level"],
                body: {
                    suggest: {
                        text: term,
                        label_suggestion: {
                            prefix: term,
                            completion: {
                                field: suggestField,
                            },
                        },
                    },
                },
            });
            return response.body.suggest.label_suggestion[0].options.map(option => ({
                id: option._id,
                ...option._source
            }));
        } catch (error) {
            console.error('Error during autocomplete:', error);
            throw error;
        }
    }

    async autocompleteBothFields(index: string, term: string) {
        try {
            const categoryResponse = await this.elasticsearchService.search({
                index,
                _source: ["category", "value", "level"],
                body: {
                    suggest: {
                        text: term,
                        label_suggestion: {
                            prefix: term,
                            completion: {
                                field: 'category_suggest',
                            },
                        },
                    },
                },
            });

            const valueResponse = await this.elasticsearchService.search({
                index,
                _source: ["category", "value", "level"],
                body: {
                    suggest: {
                        text: term,
                        label_suggestion: {
                            prefix: term,
                            completion: {
                                field: 'value_suggest',
                            },
                        },
                    },
                },
            });

            const categorySuggestions = categoryResponse.body.suggest.label_suggestion[0].options.map(option => ({
                id: option._id,
                ...option._source
            }));
            const valueSuggestions = valueResponse.body.suggest.label_suggestion[0].options.map(option => ({
                id: option._id,
                ...option._source
            }));

            // Merging and deduplicating results
            const combined = [...categorySuggestions, ...valueSuggestions];
            return Array.from(new Set(combined.map(item => JSON.stringify(item)))).map(item => JSON.parse(item));
        } catch (error) {
            console.error('Error during autocomplete for both fields:', error);
            throw error;
        }
    }
}