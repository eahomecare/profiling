import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
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
import { ServiceCustomerController } from './service-customer/service-customer.controller';
import { QuestionModule } from './question/question.module';
import { ProfileMappingModule } from './profile_mapping/profile_mapping.module';
import { LangchainModule } from './langchain/langchain.module';
import { V1Module } from './api/v1/v1.module';
import { MulterMiddleware } from './api/v1/middleware/multer';
import { V1Controller } from './api/v1/v1.controller';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UserRolePermissionMappingModule } from './user-role-permission-mapping/user-role-permission-mapping.module';
import { CampaignModule } from './campaign/campaign.module';
import { TemplateModule } from './template/template.module';
import { EventModule } from './event/event.module';

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
    QuestionModule,
    ProfileMappingModule,
    LangchainModule,
    V1Module,
    RolesModule,
    PermissionsModule,
    UserRolePermissionMappingModule,
    CampaignModule,
    TemplateModule,
    EventModule,
    // SearchModule,
  ],
  controllers: [ServiceCustomerController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MulterMiddleware)
      .forRoutes(V1Controller);
  }
}
