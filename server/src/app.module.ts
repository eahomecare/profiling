import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
<<<<<<< HEAD
import { KeywordModule } from './keyword/keyword.module';
// import { SearchModule } from './search/search.module';
import { OccupationModule } from './occupation/occupation.module';
import { VehicleDetailModule } from './vehicle_detail/vehicle_detail.module';
=======
>>>>>>> 10bc3a679589f1eefff6aad596ec2a69cda37e7c

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    CustomerModule,
<<<<<<< HEAD
    KeywordModule,
    OccupationModule,
    VehicleDetailModule,
    // SearchModule,
=======
>>>>>>> 10bc3a679589f1eefff6aad596ec2a69cda37e7c
  ],
})
export class AppModule {}
