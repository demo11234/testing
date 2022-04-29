export const UserService = jest.fn().mockReturnValue({
    getPresignedURL: jest.fn().mockResolvedValue({success: true}),
    findUser: jest.fn().mockResolvedValue({ message: { access_token: "abcefgh", success: true }, status: 200, success: true }),
    findUserByUserName: jest.fn().mockResolvedValue({ walletAdress: "string" }),
})