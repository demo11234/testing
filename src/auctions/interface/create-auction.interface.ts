import { auctionType, timedAuctionMethod } from 'shared/Constants';
import { Bundle, ReservedAuction } from '../entities/auctions.entity';

export class CreateAuctionInterface {
  auction_items?: string;
  auction_bundle?: string[];
  auction_collection: string;
  startDate: number;
  endDate: number;
  tokens: string;
  auctionType: auctionType;
  bundle?: Bundle;
  reservedAuction?: ReservedAuction;
  quantity?: number;
  startingPrice?: number;
  endingPrice?: number;
  reservedPrice?: number;
  timedAuctionMethod?: timedAuctionMethod;
}
