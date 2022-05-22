import { Signature } from '../entities/offer.entity';

export class CreateSignatureInterface {
  offerId: string;
  signature: Signature;
}
