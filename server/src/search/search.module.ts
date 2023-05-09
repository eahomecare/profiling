import {
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ) => ({
        node: configService.get(
          'ELASTICSEARCH_NODE',
        ),
        auth: {
          username: configService.get(
            'ELASTICSEARCH_USERNAME',
          ),
          password: configService.get(
            'ELASTICSEARCH_PASSWORD',
          ),
        },
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
// export class SearchModule implements OnModuleInit {
//     constructor(private searchService: SearchService) { }
//     onModuleInit() {
//         this.searchService.create('test', '1', { test: 'test' }).then();
//     }
// }
export class SearchModule {}
