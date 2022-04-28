import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChainsTokensDto } from './dto/chains-token.dto';
import { CreateChainsDto } from './dto/create-chains.dto';
import { CreateTokensDto } from './dto/create-tokens.dto';
import { UpdateChainsDto } from './dto/update-chains.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';
import { Chains } from './entities/chains.entity';
import { Tokens } from './entities/tokens.entity';

@Injectable()
export class ChainsService {
  constructor(
    @InjectRepository(Chains) private chainsRepository: Repository<Chains>,
    @InjectRepository(Tokens) private tokensRepository: Repository<Tokens>,
  ) {}

  /**
   * @description createChain will create the chain
   * @param createChainsDto
   * @returns it will return created chain details
   * @author Jeetanshu Srivastava
   */
  async createChain(createChainsDto: CreateChainsDto): Promise<Chains> {
    let chain = new Chains();

    const keys = Object.keys(createChainsDto);
    keys.forEach((key) => {
      chain[key] = createChainsDto[key];
    });

    chain = await this.chainsRepository.save(chain);
    return chain;
  }

  /**
   * @description updateChain will update a particular chain
   * @param updateChainsDto
   * @returns it will return updated chain details
   * @author Jeetanshu Srivastava
   */
  async updateChain(updateChainDto: UpdateChainsDto): Promise<Chains> {
    const { id } = updateChainDto;

    const chain = await this.chainsRepository.findOne({
      where: { id },
    });

    if (!chain) return null;

    const keys = Object.keys(updateChainDto);
    keys.forEach((key) => {
      chain[key] = UpdateChainsDto[key];
    });

    return await this.chainsRepository.save(chain);
  }

  /**
   * @description getChainsForAdmin will return the details of all chains for admin
   * @returns it will return details of all chains
   * @author Jeetanshu Srivastava
   */
  async getChainsForAdmin(): Promise<Chains[]> {
    const chains = await this.chainsRepository.find();
    return chains;
  }

  /**
   * @description getChainsForUser will return the details of all chains for user
   * @returns it will return details of all chains
   * @author Jeetanshu Srivastava
   */
  async getChainsForUser(): Promise<Chains[]> {
    const chains = await this.chainsRepository.find();
    return chains;
  }

  /**
   * @description createToken will create the token for the given chain
   * @param createTokensDto
   * @returns it will return created token details
   * @author Jeetanshu Srivastava
   */
  async createToken(createTokensDto: CreateTokensDto): Promise<Tokens> {
    let token = new Tokens();

    const chain = await this.chainsRepository.findOne({
      id: createTokensDto.chainId,
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

    const chain = await this.chainsRepository.findOne({
      where: {
        id: chainId,
      },
    });

    if (!chain) return null;

    const keys = Object.keys(updateTokenDto);
    keys.forEach((key) => {
      chain[key] = UpdateChainsDto[key];
    });

    token.chainId = chain.id;

    return await this.tokensRepository.save(token);
  }

  /**
   * @description getTokensForAdmin will return the details of all tokens for admin
   * @returns it will return details of all tokens
   * @author Jeetanshu Srivastava
   */
  async getTokensForAdmin(chainsTokensDto: ChainsTokensDto): Promise<Tokens[]> {
    const { chainId } = chainsTokensDto;
    const tokens = await this.tokensRepository.find({
      where: {
        chainId,
      },
    });
    return tokens;
  }

  /**
   * @description getTokensForUser will return the details of all tokens for user
   * @returns it will return details of all tokens
   * @author Jeetanshu Srivastava
   */
  async getTokensForUser(chainsTokensDto: ChainsTokensDto): Promise<Tokens[]> {
    const { chainId } = chainsTokensDto;
    const tokens = await this.tokensRepository.find({
      where: {
        chain: {
          chainId,
        },
      },
    });
    return tokens;
  }
}
