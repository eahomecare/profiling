import { Module, Global } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

@Global()
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
        // Uncomment and configure authentication if needed
        // auth: {
        //   username: configService.get('ELASTICSEARCH_USERNAME'),
        //   password: configService.get('ELASTICSEARCH_PASSWORD'),
        // },
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        sniffOnStart: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ElasticsearchModule],
})
export class ElasticsearchConfigModule {}
