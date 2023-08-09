import { Module } from '@nestjs/common';
import { UserRolePermissionMappingService } from './user-role-permission-mapping.service';
import { UserRolePermissionMappingController } from './user-role-permission-mapping.controller';

@Module({
  providers: [UserRolePermissionMappingService],
  controllers: [UserRolePermissionMappingController]
})
export class UserRolePermissionMappingModule {}
