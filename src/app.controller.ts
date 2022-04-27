import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { top } from './top';
import { topCollection } from './topCollection';

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

  @Get('topCategory')
  @ApiOkResponse({ description: 'top  category' })
  async topCategory(): Promise<any> {
    return top();
  }

  @Get('topCollection')
  @ApiOkResponse({ description: 'topTrending' })
  async topTrending(): Promise<any> {
    return topCollection();
  }
}
