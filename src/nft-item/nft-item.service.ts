import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseMessage } from 'shared/ResponseMessage';
import { Chains } from 'src/chains/entities/chains.entity';
import { Collection } from 'src/collections/entities/collection.entity';
import { ILike, LessThan, Like, MoreThan, Repository } from 'typeorm';
import { FilterDto } from './dto/filter.dto';
import { NftItemDto } from './dto/nft-item.dto';
import { UpdateNftItemDto } from './dto/update.nftItem.dto';
import { NftItem } from './entities/nft-item.entities';

@Injectable()
export class NftItemService {
    constructor(
        
        @InjectRepository(Collection)
        private readonly collectionRepository: Repository<Collection>,
        @InjectRepository(NftItem)
        private readonly nftItemRepository: Repository<NftItem>,
        @InjectRepository(Chains)
        private chainsRepository: Repository<Chains>,

    ){}

    /**
   * @description: This api create the item and returns status
   * @param NftItemDto
   * @param user
   * @returns: create Item
   * @author: vipin
   */
    async createNftItem (user, nftItemDto: NftItemDto): Promise<any>{
        try {
            let nftItem = new NftItem()
            nftItem.walletAddress = user.walletAddress
            nftItem.originalOwner = user.walletAddress
            const collection = await this.collectionRepository.findOne({
                where: { id: nftItemDto.collectionId },
            });
            nftItem.collection = collection
            nftItem.description = nftItemDto.description

            const chains = await this.chainsRepository.findOne({
                where: { id: nftItemDto.blockChainId },
            });
            nftItem.blockChain = chains

            nftItem.isExplicit = nftItemDto.isExplicit
            nftItem.externalUrl = nftItemDto.externalUrl
            nftItem.fileUrl = nftItemDto.fileUrl
            nftItem.levels = nftItemDto.levels
            nftItem.properties = nftItemDto.properties
            nftItem.stats = nftItemDto.stats
            nftItem.supply = nftItemDto.supply
            nftItem.isLockable = nftItemDto.isLockable
            nftItem.lockableContent = nftItemDto.lockableContent
            nftItem.fileName = nftItemDto.fileName

            const data = await this.nftItemRepository.save(nftItem);

            if (data) return data;
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    /**
   * @description: This api find item and returns status
   * @param filterDto
   * @returns: find Item
   * @author: vipin
   */
    async findNftItems(filterDto: FilterDto): Promise<any>{
        try{
            const {walletAddress, sortBy, order: orderBy} = filterDto
            const where: {} | any = {};

            // if(status){
            //     // const new = Date.now() - 1000*60*60*24

            //     where.createdAt = ILike(`%${"2022-05-04T11:16:36.725Z"}%`);
            // }

            let order = {};
            if (sortBy === "date") {
            switch (orderBy) {
                case "asc":
                    order["createdAt"] = "ASC";
                    break;
                case "desc":
                    order["createdAt"] = "DESC";
                    break;
                default:
                    order["id"] = "ASC";
                }
            }
            where.walletAddress = ILike(`%${walletAddress}%`);

            const data = await this.nftItemRepository.find({
                where,
                order,
                relations: ["collection", "blockChain"],
            })
            return data;
        }catch (error){
            throw new Error(error);
        }
    }
    
    /**
   * @description: This api updates the item and returns status
   * @param id
   * @param UpdateNftItemDto
   * @returns: Update Item
   * @author: vipin
   */
    async updateNftItems(id: string, updateNftItemDto: UpdateNftItemDto): Promise<any>{
        try{   
            let updateNftItem = new NftItem()
            updateNftItem.description = updateNftItemDto.description
            updateNftItem.externalUrl = updateNftItemDto.externalUrl
            updateNftItem.fileName = updateNftItemDto.fileName
            updateNftItem.fileUrl = updateNftItemDto.fileUrl
            updateNftItem.isExplicit = updateNftItemDto.isExplicit
            updateNftItem.isLockable = updateNftItemDto.isLockable
            updateNftItem.levels = updateNftItemDto.levels
            updateNftItem.lockableContent = updateNftItemDto.lockableContent
            updateNftItem.properties = updateNftItemDto.properties
            updateNftItem.stats = updateNftItemDto.stats
            const collection = await this.collectionRepository.findOne({
                where: { id: updateNftItemDto.collectionId },
            });
            updateNftItem.collection = collection

            const update = await this.nftItemRepository.update({id}, updateNftItem)
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
