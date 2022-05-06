import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  ) {}
  async createOffer(
    createOfferDto: CreateOfferDto,
    ownerWalletAddress: string,
  ): Promise<any> {
    const owner = await this.userRepository.findOne({
      walletAddress: ownerWalletAddress,
    });
    console.log('owner', owner);
    const offer = new Offer();
    offer.Expires = createOfferDto.Expires;
    offer.price = createOfferDto.price;
    offer.isDeleted = false;
    offer.owner = owner;
    offer.item = createOfferDto.item;
    offer.paymentToken = createOfferDto.paymentToken;
    await this.offerRepository.save(offer);
    return offer;
  }

  async delete(id: string): Promise<any> {
    const toBeDeleted = await this.offerRepository.findOne(id);
    toBeDeleted.isDeleted === true;
    await this.offerRepository.save(toBeDeleted);
    return null;
  }

  async update(id: string, updateOfferDto: UpdateOfferDto): Promise<any> {
    const updatedOffer = await this.offerRepository.update(id, updateOfferDto);
    return updatedOffer;
  }

  async findOne(id: string): Promise<any> {
    try {
      const offer = await this.offerRepository.findOne(id);
      return offer;
    } catch (error) {
      return { message: 'Internal Server Error', error };
    }
  }

  async getOffers(offerFilerDto: OfferFilterDto): Promise<any> {
    let offer;
    if (offerFilerDto.item) {
      offer = await this.offerRepository
        .createQueryBuilder('offer')
        .select('offer')
        .from(Offer, 'offer')
        .where('offer.item = :item', { item: offerFilerDto.item })
        .andWhere('offer.isDeleted = false')
        .take()
        .skip()
        .getOne();
    } else {
      offer = await this.offerRepository
        .createQueryBuilder('offer')
        .select('offer')
        .from(Offer, 'offer')
        .where('offer.owner = :owner', { owner: offerFilerDto.user })
        .andWhere('offer.isDeleted = false')
        .take()
        .skip()
        .getOne();
    }
    return offer;
  }
}
