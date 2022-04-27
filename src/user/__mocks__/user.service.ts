export const UserService = jest.fn().mockReturnValue({
    update: jest.fn().mockResolvedValue({success: true}),
})