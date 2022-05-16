import 'dotenv/config';

import Web3 from 'web3';

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.HTTP_PROVIDER),
);

export default web3;
