export enum eventActions {
  CREATED = 'Created', //Mint
  SUCCESSFUL = 'Successful',
  CANCELLED = 'Cancelled',
  BID_ENTERED = 'BidEntered', //Listing
  BID_WITHDRAWN = 'BidWithdrawn',
  TRANSFER = 'Transfer', //Sales
  OFFER_ENTERED = 'OfferEntered',
  APPROVE = 'Approve',
}

export enum eventType {
  LISTING = 'Listing',
  SALES = 'Sales',
  BIDS = 'Bids',
  TRANSFERS = 'Tansfers',
}

