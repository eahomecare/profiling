import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role, Prisma } from '@prisma/client';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    async createRole(@Body() roleData: Prisma.RoleCreateInput): Promise<Role> {
        return this.rolesService.create(roleData);
    }

    @Get()
    async getAllRoles(): Promise<Role[]> {
        return this.rolesService.findAll();
    }

    @Get('users/:roleId')
    async getUsersByRoleId(@Param('roleId') roleId: string): Promise<any[]> {
        return this.rolesService.findUsersByRoleId(roleId);
    }

    @Get('users/:userId')
    async getRolesByUserId(@Param('userId') userId: string): Promise<Role[]> {
        return this.rolesService.findRolesByUserId(userId);
    }

    @Patch('update_permission/:roleId')
    async updateDefaultRoles(
        @Param('roleId') roleId: string,
        @Body('permissionsIds') permissionsIds: string[],
    ): Promise<Role> {
        return this.rolesService.updateDefaultPermissions(roleId, permissionsIds);
    }
}
