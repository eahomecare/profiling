import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { ProfileCountWidgetService } from './profileCountWidget.service';
import { ProfileDistributionDto } from './dto/profileDistributionDto';

@Controller('profile-count-widget')
export class ProfileCountWidgetController {
  private readonly logger = new Logger(
    ProfileCountWidgetController.name,
  );

  constructor(
    private readonly profileCountWidgetService: ProfileCountWidgetService,
  ) {}

  @Get('menu-items')
  async getMenuItems() {
    try {
      const firstMenuItems =
        await this.profileCountWidgetService.getFirstMenuItems();
      const secondMenuItems =
        await this.profileCountWidgetService.getSecondMenuItems();
      return { firstMenuItems, secondMenuItems };
    } catch (error) {
      this.logger.error(
        `Failed to get menu items: ${error.message}`,
      );
    }
  }

  @Post('distribution')
  @UsePipes(
    new ValidationPipe({ transform: true }),
  )
  async getCustomerDistribution(
    @Body()
    profileDistributionDto: ProfileDistributionDto,
  ) {
    try {
      const distribution =
        await this.profileCountWidgetService.getCustomerDistribution(
          profileDistributionDto.profileType,
          profileDistributionDto.demographic,
        );
      return distribution;
    } catch (error) {
      this.logger.error(
        `Failed to get customer distribution: ${error.message}`,
      );
    }
  }
}
