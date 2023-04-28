import { Module, OnModuleInit } from '@nestjs/common';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                node: configService.get('ELASTICSEARCH_NODE'),
                maxRetries: 10,
                requestTimeout: 60000,
                pingTimeout: 60000,
                sniffOnStart: true,
            }),
            inject: [ConfigService],
        }),
        ConfigModule,
    ],
    providers: [SearchService],
    exports: [SearchService],
})
export class SearchModule implements OnModuleInit {
    constructor(private searchService: SearchService) { }
    onModuleInit() {
        this.searchService.create('test', '1', { test: 'test' }).then();
    }
}
// import { Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ElasticsearchModule } from '@nestjs/elasticsearch';
// import { SearchService } from './search.service';

// @Module({
//     imports: [
//         ConfigModule,
//         ElasticsearchModule.registerAsync({
//             imports: [ConfigModule],
//             useFactory: async (configService: ConfigService) => ({
//                 node: configService.get('ELASTICSEARCH_NODE'),
//             }),
//             inject: [ConfigService],
//         }),
//     ],
//     exports: [ElasticsearchModule],
//     // exports: [SearchService],
//     providers: [SearchService]
// })
// export class SearchModule { }