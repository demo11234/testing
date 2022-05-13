import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OfferFilterDto } from './dto/offer-filter.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(NftItem)
    private readonly nftItemRepository: Repository<NftItem>,
  ) {}

  /**
   * @description createOffer will create new offer
   * @body CreateOfferDto
   * @returns Details of created offer
   * @author Ansh Arora
   */
  async createOffer(
    createOfferDto: CreateOfferDto,
    ownerWalletAddress: string,
  ): Promise<any> {
    const owner = await this.userRepository.findOne({
      walletAddress: ownerWalletAddress,
    });
    const item = await this.nftItemRepository.findOne({id: createOfferDto.item});
    console.log('owner', owner);
    const offer = new Offer();
    offer.Expires = createOfferDto.Expires;
    offer.price = createOfferDto.price;
    offer.isDeleted = false;
    offer.owner = owner;
    offer.item = item;
    offer.paymentToken = createOfferDto.paymentToken;
    await this.offerRepository.save(offer);
    return offer;
  }

  /**
   * @description soft deletes the offer
   * @param id
   * @author Ansh Arora
   */
  async delete(id: string): Promise<any> {
    const toBeDeleted = await this.offerRepository.findOne(id);
    toBeDeleted.isDeleted === true;
    await this.offerRepository.save(toBeDeleted);
    return null;
  }

  /**
   * @description updates the offer
   * @body UpdateOfferDto
   * @returns Details of updated offer
   * @author Ansh Arora
   */
  async update(id: string, updateOfferDto: UpdateOfferDto): Promise<any> {
    const updatedOffer = await this.offerRepository.update(id, updateOfferDto);
    return updatedOffer;
  }

  /**
   * @description fetches offer by id
   * @param id
   * @returns Details of the offer
   * @author Ansh Arora
   */
  async findOne(id: string): Promise<any> {
    try {
      const offer = await this.offerRepository.findOne(id);
      return offer;
    } catch (error) {
      return { message: 'Internal Server Error', error };
    }
  }

  /**
   * @description fetches multiple offers based on item with pagination
   * @body OfferFilterDto
   * @returns Details of offers
   * @author Ansh Arora
   */
  async getOffers(offerFilerDto: OfferFilterDto): Promise<any> {
    const { take, skip } = offerFilerDto;
    const offers = await this.offerRepository.findAndCount({
      take,
      skip,
      where: { item: offerFilerDto.item },
    });
    return offers;
  }
}
