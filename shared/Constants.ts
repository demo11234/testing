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
  LISTED = 'Listed',
  MINTED = 'Minted',
  SUCCESSFUL = 'Successful',
  CANCELLED = 'Cancelled',
  BID_ENTERED = 'BidEntered',
  BID_WITHDRAWN = 'BidWithdrawn',
  TRANSFER = 'Transfer',
  OFFER_ENTERED = 'OfferEntered',
  OFFER_WITHDRAWN = 'OfferWithdrawn',
  APPROVE = 'Approve',
}

export enum eventType {
  LISTING = 'Listing',
  SALES = 'Sales',
  BIDS = 'Bids',
  TRANSFERS = 'Transfers',
}

export enum auctionType {
  FIXED_PRICE = 'Fixed Price',
  TIMED_AUCTION = 'Timed Auction',
}

export enum timedAuctionMethod {
  SELL_TO_HIGHEST_BIDDER = 'Sell to Highest Bidder',
  SELL_WITH_DECLINING_PRICE = 'Sell with Declining Price',
}

export enum findOfferByUserType {
  SENT = 'sent',
  RECIEVED = 'recieved',
}

export const registerProxyAddr = '0x044A33A53AD47b6bA4E5A598Ef2651eAfe4aAfB6';
export const nftItemAddr = '0x1492bC58C647e022dEef9ccda0288b10818e7905';

export enum FeeMethod {
  PROTOCOL_FEE = 0,
  SPLIT_FEE = 1,
}

export enum Side {
  BUY = 0,
  SELL = 1,
}

export enum SaleKind {
  FIXED_PRICE = 0,
  DUTCH_AUCTION = 1,
}

export enum HowToCall {
  Call = 0,
  DelegateCall = 1,
}
