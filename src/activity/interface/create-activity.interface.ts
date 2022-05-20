import { eventActions, eventType } from '../../../shared/Constants';

export interface CreateActivityInterface {
  eventActions?: eventActions;
  nftItem?: string;
  eventType?: eventType;
  fromAccount?: string;
  toAccount?: string;
  isPrivate?: boolean;
  totalPrice?: number;
  previousTotalPrice?: number;
  quantity?: number;
  collectionId?: string;
  winnerAccount?: string;
}
