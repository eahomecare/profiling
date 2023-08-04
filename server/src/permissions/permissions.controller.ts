import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission, Prisma } from '@prisma/client';

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }

    @Post()
    async createPermission(@Body() permissionData: Prisma.PermissionCreateInput): Promise<Permission> {
        return this.permissionsService.create(permissionData);
    }

    @Get()
    async getAllPermissions(): Promise<Permission[]> {
        return this.permissionsService.findAll();
    }

    @Get('users/:permissionId')
    async getUsersByPermissionId(@Param('permissionId') permissionId: string): Promise<any[]> {
        return this.permissionsService.findUsersByPermissionId(permissionId);
    }

    @Get('users/:userId')
    async getPermissionsByUserId(@Param('userId') userId: string): Promise<Permission[]> {
        return this.permissionsService.findPermissionsByUserId(userId);
    }

    @Patch('update_roles/:permissionId')
    async updateDefaultRoles(
        @Param('permissionId') permissionId: string,
        @Body('roleIds') roleIds: string[],
    ): Promise<Permission> {
        return this.permissionsService.updateDefaultRoles(permissionId, roleIds);
    }
}
