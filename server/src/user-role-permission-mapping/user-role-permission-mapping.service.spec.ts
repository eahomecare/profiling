import { Test, TestingModule } from '@nestjs/testing';
import { UserRolePermissionMappingService } from './user-role-permission-mapping.service';

describe('UserRolePermissionMappingService', () => {
  let service: UserRolePermissionMappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRolePermissionMappingService],
    }).compile();

    service = module.get<UserRolePermissionMappingService>(UserRolePermissionMappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
