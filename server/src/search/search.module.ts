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
  imports: [],
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
