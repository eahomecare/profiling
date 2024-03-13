import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProfileCountWidgetController } from './profileCountWidget.controller';
import { ProfileCountWidgetService } from './profileCountWidget.service';

@Module({
  imports: [],
  controllers: [ProfileCountWidgetController],
  providers: [ProfileCountWidgetService],
  exports: [ProfileCountWidgetService],
})
export class ProfileCountWidgetModule {}
