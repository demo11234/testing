export const userStub = () => {
    return {
      id: 'adadw1213',
      walletAddres: '1',
      username: 'abc@mohan.com',
      firstName: 'vipin',
      lastName: 'abc',
      userName: 'aghjg',
      walletAddress: 'gaduguy2313',
      isEmailVerified: false,
      imageUrl: '',
      createdAt:new Date(),
      updatedAt:new Date()
    };
};
export const notificationStub = () => {
    return {
    itemSold: true,
    bidActivity: true,
    priceChange: true,
    auctionExpiration: true,
    outBid: false,
    ownedItemUpdates: false,
    successfulPurchase: false,
    jungleNewsletter: false,
    minimumBidThreshold: 1
    }
}
