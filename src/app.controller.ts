import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   *
   * @returns Httpstatus 200 OK response
   * This is to check health of app
   * @author Mohan Chaudhari
   */
  @Get()
  healthCheck(): Promise<any> {
    return this.appService.healthCheck();
  }
}
