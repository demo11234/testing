import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { categoryMockdata } from './categoryMockdata';
import { notableDrops } from './notabledrops';

@Controller()
@ApiTags('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   *
   * @returns Httpstatus 200 OK response
   * This is to check health of app
   * @author Mohan Chaudhari
   */
  @Get()
  @ApiOkResponse({ description: 'checks health of app' })
  healthCheck(): Promise<any> {
    return this.appService.healthCheck();
  }

  /**
   *
   * @returns mock data for categories
   */
  @Get('category')
  @ApiOkResponse({ description: 'category' })
  async categoryMockdata(): Promise<any> {
    return categoryMockdata();
  }
  /**
   *
   * @returns notable drops mock data
   */
  @Get('notableDrops')
  @ApiOkResponse({ description: 'notable drops' })
  async notableDrops(): Promise<any> {
    return notableDrops();
  }
  /**
   *
   * @returns top trending
   */
  @Get('toptrending/:filterTime')
  @ApiOkResponse({ description: 'top trending' })
  async toptrending(@Param('filerTime') filerTime: string): Promise<any> {
    return notableDrops();
  }
  @Get('topCollections/:filterTime')
  @ApiOkResponse({ description: 'top collections' })
  async topCollections(@Param('filerTime') filerTime: string): Promise<any> {
    return notableDrops();
  }
}
