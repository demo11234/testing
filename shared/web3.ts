import 'dotenv/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:7545'));

//const provider = new Web3.providers.HttpProvider(process.env.HTTP_PROVIDER);
//const web3 = new Web3(provider);

export default web3;
