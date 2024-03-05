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
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateProfileTypeDto } from './dto/create-profile-type.dto';
import { UpdateProfileTypeDto } from './dto/update-profile-type.dto';
import { ProfileTypesService } from './profile-type.service';

@Controller('profile-types')
export class ProfileTypeController {
  private readonly logger = new Logger(
    ProfileTypeController.name,
  );

  constructor(
    private readonly profileTypeService: ProfileTypesService,
  ) {}

  @Get()
  async getAllProfileTypes(@Res() res: Response) {
    try {
      this.logger.log(
        'Fetching all profile types',
      );
      const profileTypes =
        await this.profileTypeService.getAllProfileTypes();
      res
        .status(HttpStatus.OK)
        .json(profileTypes);
    } catch (error) {
      this.logger.error(
        `Failed to fetch all profile types: ${error.message}`,
        error.stack,
      );
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
      this.logger.log(
        'Creating a new profile type',
      );
      const profileType =
        this.profileTypeService.createProfileType(
          createProfileTypeDto,
        );
      res
        .status(HttpStatus.CREATED)
        .json(profileType);
    } catch (error) {
      this.logger.error(
        `Failed to create a new profile type: ${error.message}`,
        error.stack,
      );
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
    this.logger.log(
      `Updating profile type with ID ${id}`,
    );
    try {
      const profileType =
        await this.profileTypeService.updateProfileType(
          id,
          updateProfileTypeDto,
        );
      res.status(HttpStatus.OK).json(profileType);
    } catch (error) {
      this.logger.error(
        `Failed to update profile type with ID ${id}: ${error.message}`,
        error.stack,
      );
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

    this.logger.error(
      `Handling exception: ${message}`,
      error.stack,
    );
    res.status(statusCode).json({
      success: false,
      status: statusCode,
      ...(typeof message === 'string'
        ? { message }
        : message),
    });
  }
}
