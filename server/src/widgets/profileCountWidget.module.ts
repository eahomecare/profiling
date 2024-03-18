import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProfileCountWidgetController } from './profileCountWidget.controller';
import { ProfileCountWidgetService } from './profileCountWidget.service';
import { Widget2Controller } from './widget2.controller';

@Module({
  imports: [],
  controllers: [
    ProfileCountWidgetController,
    Widget2Controller,
  ],
  providers: [ProfileCountWidgetService],
  exports: [ProfileCountWidgetService],
})
export class ProfileCountWidgetModule {}
