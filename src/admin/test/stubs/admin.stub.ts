export const adminUpdatedReturn = () => {
  return {};
};

export const adminReturnStub = () => {
  return {
    firstName: 'mohan',
    lastName: 'mohan',
    username: 'mohan1@mohan.com',
    active: true,
    // password: 'Mohan1@#',
    id: 'ff822dbe-ad22-4d70-9a9f-c12c5048a4f7',
    createdAt: '2022-04-21T04:13:02.740Z',
    updatedAt: '2022-04-21T04:13:02.740Z',
  };
};

export const createAdminStub = () => {
  return {
    firstName: 'mohan',
    lastName: 'mohan',
    username: 'mohan1@mohan.com',
    password: 'Mohan1@#',
  };
};

export const loginAdminStub = () => {
  return {
    username: 'mohan1@mohan.com',
    password: 'Mohan1@#',
  };
};

export const loginAdminReturnStub = () => {
  return {
    token: 'fdhvbdjksvbsdjkcbdsjk',
  };
};

export const updateAdminReturnStub = () => {
  return {
    status: 200,
    msg: 'Admin updated succesfully',
  };
};
