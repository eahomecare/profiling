import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
import { KeywordModule } from './keyword/keyword.module';
// import { SearchModule } from './search/search.module';
import { OccupationModule } from './occupation/occupation.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileModule } from './profile/profile.module';
import { CustomerQuestionHistoryModule } from './customer-question-history/customer-question-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    CustomerModule,
    KeywordModule,
    OccupationModule,
    ProfileModule,
    CustomerQuestionHistoryModule
    // SearchModule,
  ],
})
export class AppModule {}
