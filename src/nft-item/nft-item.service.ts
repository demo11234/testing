import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { NftItemDto } from './dto/nft-item.dto';
import { NftItem } from './entities/nft-item.entities';

@Injectable()
export class NftItemService {
    constructor(
        @InjectRepository(NftItem)
        private readonly nftItemRepository: Repository<NftItem>
    ){}

    async createNftItem (user,nftItemDto: NftItemDto): Promise<any>{
        try {
            let nftItem = new NftItem()
            nftItem.walletAddress = user.walletAddress
            nftItem.ownerId = user.id
            nftItem.owner = user.userName
            nftItem.collection = nftItemDto.collection
            nftItem.description = nftItemDto.description
            nftItem.blockChain = nftItemDto.blockChain
            nftItem.explicit = nftItemDto.explicit
            nftItem.externalUrl = nftItemDto.externalUrl
            nftItem.fileUrl = nftItemDto.fileUrl
            nftItem.levels = nftItemDto.levels
            nftItem.properties = nftItemDto.properties
            nftItem.stats = nftItemDto.stats
            nftItem.supply = nftItemDto.supply
            nftItem.unlockable = nftItemDto.unlockable
            nftItem.unlockableContent = nftItemDto.unlockableContent
            // nftItem.collection = nftItemDto.fileName
            // nftItem.collection = nftItemDto.fileName


            const data = this.nftItemRepository.save(nftItem);
            return data;
        } catch (error) {
            throw new Error(error);
        }
    }

    async findNftItems(search: string): Promise<any>{
        try{
            const data = this.nftItemRepository.find(
                // {$or:[
                {walletAddress: Like(`%${search}%`)},
                // {collection: Like(`%${search}%`)}
            // ]}
            )
        }catch (error){
            throw new Error(error);
        }
    }
}
