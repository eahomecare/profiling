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
import { Widget3DistributionDto } from './dto/widget3Distribution.dto';

@Controller('widget3')
export class Widget3Controller {
  private readonly logger = new Logger(
    Widget3Controller.name,
  );

  constructor(
    private readonly profileCountWidgetService: ProfileCountWidgetService,
  ) {}

  @Get('getMenuItems')
  async getWidget3MenuItems() {
    try {
      const menuItems =
        await this.profileCountWidgetService.getWidget3MenuItems();
      return menuItems;
    } catch (error) {
      this.logger.error(
        `Failed to get widget3 menu items: ${error.message}`,
      );
      throw new Error(
        'Error fetching widget3 menu items',
      );
    }
  }

  @Post('getDistribution')
  @UsePipes(
    new ValidationPipe({ transform: true }),
  )
  async getWidget3Distribution(
    @Body()
    widget3DistributionDto: Widget3DistributionDto,
  ) {
    try {
      const distribution =
        await this.profileCountWidgetService.getWidget3Distribution(
          widget3DistributionDto.source,
          widget3DistributionDto.year,
          widget3DistributionDto.month,
        );
      return distribution;
    } catch (error) {
      this.logger.error(
        `Failed to get widget3 distribution: ${error.message}`,
      );
      throw new Error(
        'Error fetching widget3 distribution',
      );
    }
  }
}
