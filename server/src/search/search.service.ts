import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {
    constructor(private readonly elasticsearchService: ElasticsearchService) { }

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
}