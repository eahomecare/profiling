import { Module } from '@nestjs/common';
import { QueryService } from './assistant.service';
import { QueryController } from './assistant.controller';
import { PrismaService } from './../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [QueryController],
  providers: [QueryService, PrismaService],
})
export class QueryModule {}
