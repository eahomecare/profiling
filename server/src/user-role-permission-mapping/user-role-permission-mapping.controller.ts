import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserRolePermissionMappingService } from './user-role-permission-mapping.service';
import { userRolePermissionMapping, Prisma } from '@prisma/client';

@Controller('user-role-permission-mappings')
export class UserRolePermissionMappingController {
    constructor(private readonly userRolePermissionMappingService: UserRolePermissionMappingService) { }

    @Post()
    async createMapping(@Body() mappingData: Prisma.userRolePermissionMappingCreateInput): Promise<userRolePermissionMapping> {
        return this.userRolePermissionMappingService.create(mappingData);
    }

    @Get()
    async getAllMappings(): Promise<userRolePermissionMapping[]> {
        return this.userRolePermissionMappingService.findAll();
    }

    @Get('users/:userId')
    async getMappingsByUserId(@Param('userId') userId: string): Promise<userRolePermissionMapping[]> {
        return this.userRolePermissionMappingService.findMappingsByUserId(userId);
    }

    @Get('roles/:roleId')
    async getMappingsByRoleId(@Param('roleId') roleId: string): Promise<userRolePermissionMapping[]> {
        return this.userRolePermissionMappingService.findMappingsByRoleId(roleId);
    }
}
