import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('algoliaUserUpload')
  async algoliaUserUpload() {
    return await this.servicesService.algoliaUserUpload();
  }

  @Get('algoliaCollectionUpload')
  async algoliaCollectionUpload() {
    return await this.servicesService.algoliaCollectionUpload();
  }

  @Get('IpfsuploadMetadata')
  async IpfsuploadMetadata() {
    console.log('in controller');
    return await this.servicesService.IpfsuploadMetadata();
  }

  /*
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
  */
}
