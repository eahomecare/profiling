import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { ProfileCountWidgetService } from './profileCountWidget.service';
import { Widget2DistributionDto } from './dto/widget2Distribution.dto';

@Controller('widget2')
export class Widget2Controller {
  private readonly logger = new Logger(
    Widget2Controller.name,
  );

  constructor(
    private readonly profileCountWidgetService: ProfileCountWidgetService,
  ) {}

  @Get('getMenuItems')
  async getWidget2MenuItems() {
    try {
      const menuItems =
        await this.profileCountWidgetService.getWidget2MenuItems();
      return menuItems;
    } catch (error) {
      this.logger.error(
        `Failed to get widget2 menu items: ${error.message}`,
      );
      throw new Error(
        'Error fetching widget2 menu items',
      );
    }
  }

  @Post('getDistribution')
  @UsePipes(
    new ValidationPipe({ transform: true }),
  )
  async getWidget2Distribution(
    @Body()
    widget2DistributionDto: Widget2DistributionDto,
  ) {
    try {
      const distribution =
        await this.profileCountWidgetService.getWidget2Distribution(
          widget2DistributionDto.source,
          widget2DistributionDto.year,
          widget2DistributionDto.month,
        );
      return distribution;
    } catch (error) {
      this.logger.error(
        `Failed to get widget2 distribution: ${error.message}`,
      );
      throw new Error(
        'Error fetching widget2 distribution',
      );
    }
  }
}
