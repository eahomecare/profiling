import { Controller, Logger, Get } from '@nestjs/common';
import { QueueService } from '../queue/queue.service'


@Controller('queue-api')
export class QueueApiController {
    constructor(private readonly queueService: QueueService) { }

    @Get('addJob')
    async addJob() {
        try {
            await this.queueService.addImmediateJob({ message: 'Hello, World!' });
            return 'Job added to the queue: immediateJob';
        } catch (error) {
            Logger.error(`Error adding job: ${error.message}`);
            throw error;
        }
    }
}


// @Controller('queue-api')
// export class QueueApiController {
//     constructor() { }
// }
