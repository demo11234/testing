import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NftItemDto } from './dto/nft-item.dto';
import { NftItem } from './entities/nft-item.entities';

@Injectable()
export class NftItemService {
    constructor(
        @InjectRepository(NftItem)
        private readonly nftItemRepository: Repository<NftItem>
    ){}

    async createNftItem (nftItemDto: NftItemDto): Promise<any>{
        try {
            const data = this.nftItemRepository.save(nftItemDto);
            return data;
        } catch (error) {
            throw new Error(error);
        }
    }
}
