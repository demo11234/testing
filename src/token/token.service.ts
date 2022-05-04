import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokensDto } from '../token/dto/create-tokens.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';
import { Tokens } from './entities/tokens.entity';
import { Chains } from 'src/chains/entities/chains.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Tokens) private tokensRepository: Repository<Tokens>,
    @InjectRepository(Chains) private chainsRepository: Repository<Chains>,
  ) {}

  /**
   * @description createToken will create the token for the given chain
   * @param createTokensDto
   * @returns it will return created token details
   * @author Jeetanshu Srivastava
   */
  async createToken(createTokensDto: CreateTokensDto): Promise<Tokens> {
    let token = new Tokens();

    const { chainId } = createTokensDto;

    const chain = await this.chainsRepository.findOne({
      where: {
        id: chainId,
      },
    });

    if (!chain) return null;

    const keys = Object.keys(createTokensDto);
    keys.forEach((key) => {
      token[key] = createTokensDto[key];
    });

    token.chainId = chain.id;

    token = await this.tokensRepository.save(token);

    return token;
  }

  /**
   * @description updateToken will update a particular token
   * @param updateTokenDto
   * @returns it will return updated token details
   * @author Jeetanshu Srivastava
   */
  async updateToken(updateTokenDto: UpdateTokensDto): Promise<Tokens> {
    const { chainId } = updateTokenDto;

    const token = await this.tokensRepository.findOne({
      where: { id: updateTokenDto.id },
    });
    if (!token) return null;

    if (token.chainId != chainId) {
      const chain = await this.chainsRepository.findOne({
        where: {
          id: chainId,
        },
      });

      if (!chain) return null;

      token.chainId = chain.id;
    }

    const keys = Object.keys(updateTokenDto);
    keys.forEach((key) => {
      token[key] = updateTokenDto[key];
    });

    return await this.tokensRepository.save(token);
  }

  /**
   * @description getTokens will return the details of all tokens for given chainId
   * @returns it will return details of all tokens
   * @author Jeetanshu Srivastava
   */
  async getTokens(chainId: string): Promise<Tokens[]> {
    const tokens = await this.tokensRepository.find({
      where: {
        chainId,
      },
    });
    return tokens;
  }
}
