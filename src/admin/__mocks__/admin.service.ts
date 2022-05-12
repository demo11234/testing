import {
  adminReturnStub,
  loginAdminReturnStub,
  updateAdminReturnStub,
} from '../test/stubs/admin.stub';

export const AdminService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(adminReturnStub()),
  login: jest.fn().mockResolvedValue(loginAdminReturnStub()),
  updateAdmin: jest.fn().mockResolvedValue(updateAdminReturnStub()),
});
