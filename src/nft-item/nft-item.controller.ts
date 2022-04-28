import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { NftItemDto } from './dto/nft-item.dto';
import { NftItemService } from './nft-item.service';

@Controller('nft-item')
export class NftItemController {
    constructor(private readonly nftItemService: NftItemService) {}

    @ApiTags('Nft Item')
    @ApiOperation({summary:'it will create new nft item',})
    @ApiResponse({
        status: ResponseStatusCode.OK,
        description: 'Nft Created',
    })
    @Post()
    createNftItem(@Body() nftItemDto: NftItemDto): Promise<any> {
      return this.nftItemService.createNftItem(nftItemDto);
    }
    
}
