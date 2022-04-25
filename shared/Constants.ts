import 'dotenv/config';

export const Constants = {
  USER_TOKEN_VALIDITY: '24h',
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};