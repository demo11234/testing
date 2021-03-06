export interface UpdateTokensInterface {
  id: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  description?: string;
  address?: string;
  decimals?: number;
  ethPrice?: number;
  usdPrice?: number;
  active?: boolean;
}
