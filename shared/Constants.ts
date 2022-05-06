import 'dotenv/config';

export const Constants = {
  USER_TOKEN_VALIDITY: '24h',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  USER: 'User',
  ADMIN: 'Admin',
};

export enum eventActions {
  MINTED = 'Minted',
  SUCCESSFUL = 'Successful',
  CANCELLED = 'Cancelled',
  BID_ENTERED = 'BidEntered',
  BID_WITHDRAWN = 'BidWithdrawn',
  TRANSFER = 'Transfer',
  OFFER_ENTERED = 'OfferEntered',
  APPROVE = 'Approve',
}

export enum eventType {
  LISTING = 'Listing',
  SALES = 'Sales',
  BIDS = 'Bids',
  TRANSFERS = 'Transfers',
}
