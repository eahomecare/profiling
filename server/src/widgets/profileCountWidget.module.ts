import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProfileCountWidgetService } from './profileCountWidget.service';

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
        // auth: {
        //     username: configService.get(
        //         'ELASTICSEARCH_USERNAME',
        //     ),
        //     password: configService.get(
        //         'ELASTICSEARCH_PASSWORD',
        //     ),
        // },
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        sniffOnStart: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [ProfileCountWidgetService],
  exports: [ProfileCountWidgetService],
})
export class ProfileCountWidgetModule {}
