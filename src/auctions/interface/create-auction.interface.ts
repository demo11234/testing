import { auctionType, timedAuctionMethod } from 'shared/Constants';
import { Bundle, ReservedAuction } from '../entities/auctions.entity';

export class CreateAuctionInterface {
  auction_items: string[];
  startDate: number;
  endDate: number;
  tokens: string;
  auctionType: auctionType;
  bundle?: Bundle;
  reservedAuction?: ReservedAuction;
  price?: number;
  startingPrice?: number;
  endingPrice?: number;
  reservedPrice?: number;
  timedAuctionMethod?: timedAuctionMethod;
}
