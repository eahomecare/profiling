import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProfileCountWidgetController } from './profileCountWidget.controller';
import { ProfileCountWidgetService } from './profileCountWidget.service';
import { Widget2Controller } from './widget2.controller';
import { Widget3Controller } from './widget3.controller';

@Module({
  imports: [],
  controllers: [
    ProfileCountWidgetController,
    Widget2Controller,
    Widget3Controller,
  ],
  providers: [ProfileCountWidgetService],
  exports: [ProfileCountWidgetService],
})
export class ProfileCountWidgetModule {}
