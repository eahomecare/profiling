import { Test, TestingModule } from '@nestjs/testing';
import { UserRolePermissionMappingController } from './user-role-permission-mapping.controller';

describe('UserRolePermissionMappingController', () => {
  let controller: UserRolePermissionMappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRolePermissionMappingController],
    }).compile();

    controller = module.get<UserRolePermissionMappingController>(UserRolePermissionMappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
