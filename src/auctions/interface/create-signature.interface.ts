import { Signature } from '../entities/auctions.entity';

export class CreateSignatureInterface {
  auctionId: string;
  signature: Signature;
}
