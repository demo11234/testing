import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChainsDto } from './dto/create-chains.dto';
import { UpdateChainsDto } from './dto/update-chains.dto';
import { Chains } from './entities/chains.entity';

@Injectable()
export class ChainsService {
  constructor(
    @InjectRepository(Chains) private chainsRepository: Repository<Chains>,
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
      chain[key] = updateChainDto[key];
    });

    return await this.chainsRepository.save(chain);
  }

  /**
   * @description getChainsForAdmin will return the details of all chains
   * @returns it will return details of all chains
   * @author Jeetanshu Srivastava
   */
  async getChains(): Promise<Chains[]> {
    const chains = await this.chainsRepository.find();
    return chains;
  }
}
