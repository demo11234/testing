import web3 from './web3';

export const createContractInstance = (contractABI, contractAddress) => {
  const instance = new web3.eth.Contract(contractABI, contractAddress);
  return instance;
};
