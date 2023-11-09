import {
  Body,
  Controller,
  Post,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  Res,
  ValidationPipe,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateProfileTypeDto } from './dto/create-profile-type.dto';
import { UpdateProfileTypeDto } from './dto/update-profile-type.dto';
import { ProfileTypesService } from './profile-type.service';

@Controller('profile-types')
export class ProfileTypeController {
  constructor(
    private readonly profileTypeService: ProfileTypesService,
  ) {}

  @Get()
  async getAllProfileTypes(@Res() res: Response) {
    try {
      const profileTypes =
        await this.profileTypeService.getAllProfileTypes();
      res
        .status(HttpStatus.OK)
        .json(profileTypes);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @Post()
  createProfileType(
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) =>
          new HttpException(
            errors,
            HttpStatus.BAD_REQUEST,
          ),
      }),
    )
    createProfileTypeDto: CreateProfileTypeDto,
    @Res() res: Response,
  ) {
    try {
      const profileType =
        this.profileTypeService.createProfileType(
          createProfileTypeDto,
        );
      res
        .status(HttpStatus.CREATED)
        .json(profileType);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @Patch(':id')
  async updateProfileType(
    @Param('id') id: string,
    @Body(
      new ValidationPipe({
        exceptionFactory: (errors) =>
          new HttpException(
            errors,
            HttpStatus.BAD_REQUEST,
          ),
      }),
    )
    updateProfileTypeDto: UpdateProfileTypeDto,
    @Res() res: Response,
  ) {
    console.log(
      'UpdateProfileTypeDto in controller',
      updateProfileTypeDto,
    );
    try {
      const profileType =
        await this.profileTypeService.updateProfileType(
          id,
          updateProfileTypeDto,
        );
      res.status(HttpStatus.OK).json(profileType);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  private handleException(
    error: any,
    res: Response,
  ) {
    let statusCode =
      HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object =
      'Internal server error';

    if (error instanceof HttpException) {
      statusCode = error.getStatus();
      const response = error.getResponse();
      message =
        typeof response === 'object'
          ? response
          : { message: response };
    }

    res.status(statusCode).json({
      success: false,
      status: statusCode,
      ...(typeof message === 'string'
        ? { message }
        : message),
    });
  }
}
