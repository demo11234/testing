import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { NftItemDto } from './dto/nft-item.dto';
import { UpdateNftItemDto } from './dto/update.nftItem.dto';
import { NftItem } from './entities/nft-item.entities';

@Injectable()
export class NftItemService {
    constructor(
        @InjectRepository(NftItem)
        private readonly nftItemRepository: Repository<NftItem>
    ){}

    async createNftItem (user, nftItemDto: NftItemDto): Promise<any>{
        try {
            let nftItem = new NftItem()
            nftItem.walletAddress = user.walletAddress
            nftItem.ownerId = user.walletAddress
            // nftItem.owner = user.userName
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
            nftItem.fileName = nftItemDto.fileName
            // nftItem.collection = nftItemDto.fileName

            // console.log(nftItem)
            console.log(user.userName)
            const data = await this.nftItemRepository.save(nftItem);
            console.log(data)
            if (data) return data;
        } catch (error) {
            throw new Error(error);
        }
    }

    async findNftItems(search: string): Promise<any>{
        try{
            const data = await this.nftItemRepository.find(
                {walletAddress: Like(`%${search}%`)}
            )
            if (data.length !== 0) return data;
            // const data2 = await this.nftItemRepository.find({collection: Like(`%${search}%`)})
            // return data2;
        }catch (error){
            throw new Error(error);
        }
    }

    async updateNftItems(id: string, updateNftItemDto: UpdateNftItemDto): Promise<any>{
        try{
            // const item = await this.nftItemRepository.find({id})
            // if (item.length === 0) return("404")
            
            const update = await this.nftItemRepository.update({id}, updateNftItemDto)
            if (update)
            return update
        }catch (error) {
            throw new Error(error);
        }
    }

    async findOne(id: string): Promise<any>{
        try{
            const item = await this.nftItemRepository.findOne({id})
            if (item) return item
        }catch (error) {
            throw new Error(error);
        }
    }
}
