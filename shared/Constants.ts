import 'dotenv/config';

export const Constants = {
  USER_TOKEN_VALIDITY: '24h',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  USER: 'User',
  ADMIN: 'Admin',

  COLLECTION_LOGO:
    'https://jungle-development-bucket.s3.amazonaws.com/profile/1652186046441-tree-736885__480.webp',
  COLLECTION_NAME: 'Unnamed',
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
