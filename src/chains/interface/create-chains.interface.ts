export interface CreateChainsInterface {
  name: string;
  symbol: string;
  imageUrl?: string;
  baseUrl?: string;
  description?: string;
  address?: string;
  decimals?: number;
  ethPrice?: number;
  usdPrice?: number;
}
