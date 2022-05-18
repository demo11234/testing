export interface UpdateChainsInterface {
  id: string;
  chainId: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  baseUrl?: string;
  description?: string;
  address?: string;
  decimals?: number;
  ethPrice?: number;
  usdPrice?: number;
  active?: boolean;
}
