import { Module } from '@nestjs/common';
import { QueueApiController } from './queue-api.controller';
// import { QueueService } from '../queue/queue.service'
import { QueueModule } from "../queue/queue.module"


@Module({
  imports: [QueueModule],
  controllers: [QueueApiController],
  // providers: [QueueService]
})
export class QueueApiModule { }
