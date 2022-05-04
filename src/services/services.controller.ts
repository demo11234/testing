import { Controller } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // @Get('algoliaUserUpload')
  // async algoliaUserUpload() {
  //   return await this.servicesService.algoliaUserUpload();
  // }

  // @Get('algoliaCollectionUpload')
  // async algoliaCollectionUpload() {
  //   return await this.servicesService.algoliaCollectionUpload();
  // }
}
