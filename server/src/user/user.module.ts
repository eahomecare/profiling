import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRolePermissionMappingService } from '../user-role-permission-mapping/user-role-permission-mapping.service'
import { PermissionsService } from '../permissions/permissions.service';
@Module({
  controllers: [UserController],
  providers: [UserService,UserRolePermissionMappingService,PermissionsService]
})
export class UserModule {}
