import { eventType } from '../../../shared/Constants';

export interface ActivityFilterInterface {
  take?: number;
  skip?: number;
  eventType?: eventType;
  collectionId?: string;
  chain?: string;
}
