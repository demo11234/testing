import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionsDto } from './dto/create-collections.dto';
import { UpdateCollectionsDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionService: CollectionsService) {}

  /**
   * @description: 'This api creates new collection'
   * @param createCollectionDto
   * @returns: Created Collection
   * @author: Ansh Arora
   */
  @Post('create')
  create(@Body() createCollectionDto: CreateCollectionsDto) {
    return this.collectionService.create(createCollectionDto);
  }

  /**
   * @description: This apis returns all collections
   * @returns: All collections
   * @author: Ansh Arora
   */
  @Get()
  findAll() {
    return this.collectionService.findAll();
  }

  /**
   * @description: This api finds single collection using id
   * @param id
   * @returns: Single collection that matches the id
   * @author: Ansh Arora
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  /**
   * @description: This api updates the collection and returns status
   * @param id
   * @param updateCollectionDto
   * @returns: Update Staus
   * @author: Ansh Arora
   */
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionsDto,
  ) {
    return this.collectionService.update(id, updateCollectionDto);
  }
}
