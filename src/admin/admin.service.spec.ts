// import { JwtService } from '@nestjs/jwt';
// import { Test } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';

// import { AdminService } from './admin.service';
// import { Admin } from './entities/admin.entity';
// import { adminReturnStub, createAdminStub } from './test/stubs/admin.stub';

// class AdminModel {
//   constructor(private data) {}
//   save = jest.fn().mockResolvedValue(this.data);
//   //   static find = jest.fn().mockResolvedValue([userStubOld]);
//   //   static findById = jest.fn().mockResolvedValue([userStubOld]);
//   static findOne = jest.fn().mockResolvedValue(createAdminStub());
// }

// describe('AdminService', () => {
//   let adminService: AdminService;
//   let jwtService: JwtService;

//   let modelService;

//   beforeEach(async () => {
//     const module = await Test.createTestingModule({
//       providers: [
//         AdminService,
//         {
//           provide: JwtService,
//           useValue: {
//             sign: jest.fn().mockReturnValue('abcdefgh'),
//           },
//         },
//         {
//           provide: getRepositoryToken(Admin),
//           useValue: AdminModel,
//         },
//       ],
//     }).compile();
//     modelService = module.get(getRepositoryToken(Admin));

//     jwtService = module.get<JwtService>(JwtService);
//     adminService = module.get<AdminService>(AdminService);

//     jest.clearAllMocks();
//   });

//   describe('jwtSign', () => {
//     it('should check jwtservice', () => {
//       expect(jwtService.sign({ id: 1 })).toEqual('abcdefgh');
//     });
//   });

//   describe('create', () => {
//     it('should check create success', async () => {
//       //  modelService.findOne.mockResolvedValue(adminReturnStub());

//       const run = await adminService.create({
//         firstName: 'mohan',
//         lastName: 'chsudhajd',
//         username: 'vipin',
//         password: 'jvdfhkj1@',
//       });

//       expect(run).toEqual({ status: 200, admin: adminReturnStub() });
//     });

//     // it('should return deleteUser error ', async () => {
//     //   modelService.findOne.mockResolvedValue(null);
//     //   try {
//     //     const run = await userService.deleteUser('12345');
//     //   } catch (e) {
//     //     expect(e.message).toEqual(errorEnum.USER_404);
//     //   }
//     // });
//   });
// });

// // // @ts-ignore
// // export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
// //     findOne: jest.fn(entity => entity),
// //     // ...
// //   }));
