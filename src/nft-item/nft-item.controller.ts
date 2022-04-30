import { Param } from '@nestjs/common';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { GetUser } from 'src/notification/decorator/decorator';
import { User } from 'src/user/entities/user.entity';
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
    createNftItem(@GetUser() user: User,@Body() nftItemDto: NftItemDto): Promise<any> {
      return this.nftItemService.createNftItem(user,nftItemDto);
    }

    @ApiTags('Nft Item')
    @ApiOperation({summary:'it will fetch nft item',})
    @ApiResponse({
        status: ResponseStatusCode.OK,
        description: 'Nft Fetch',
    })
    @Get(':search')
    findNftItems(@Param() search: string): Promise<any> {
      return this.nftItemService.findNftItems(search);
    }

    
}
