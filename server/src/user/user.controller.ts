import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Post('create')
  createUser(@Body() data :Prisma.UserCreateInput) : Promise<User>{
    return this.userService.createUser(data)
  }


  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }


  @Patch()
  editUser(
    @GetUser('id') userId: string,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }
}
