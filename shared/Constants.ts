import 'dotenv/config';

export const Constants = {
  USER_TOKEN_VALIDITY: '24h',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  USER: 'User',
  ADMIN: 'Admin',

  eventActions: {
    CREATED: 'Created',
    SUCCESSFUL: 'Successful',
    CANCELLED: 'Cancelled',
    BID_ENTERED: 'BidEntered',
    BID_WITHDRAWN: 'BidWithdrawn',
    TRANSFER: 'Transfer',
    OFFER_ENTERED: 'OfferEntered',
    APPROVE: 'Approve',
  },

  eventType: {
    LISTING: 'Listing',
    SALES: 'Sales',
    BIDS: 'Bids',
    TRANSFERS: 'Tansfers',
  },
};
