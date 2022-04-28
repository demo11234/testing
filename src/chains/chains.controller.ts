import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResponseModel } from 'src/responseModel';
import { ChainsService } from './chains.service';
import { ChainsTokensDto } from './dto/chains-token.dto';
import { CreateChainsDto } from './dto/create-chains.dto';
import { CreateTokensDto } from './dto/create-tokens.dto';
import { UpdateChainsDto } from './dto/update-chains.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';

@Controller('chains')
export class ChainsController {
  constructor(
    private readonly chainsService: ChainsService,
    private readonly responseModel: ResponseModel,
    private readonly authService: AuthService,
  ) {}

  /**
   * @description createChain will create the chain
   * @param createChainsDto
   * @returns it will return created chain details
   * @author Jeetanshu Srivastava
   */
  @Post('/chains')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Chains')
  @ApiOperation({
    summary: 'Create new Chains',
  })
  @ApiResponse({
    status: ResponseStatusCode.CREATED,
    description: ResponseMessage.CHAIN_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async createChain(
    @Body() createChainsDto: CreateChainsDto,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    await this.authService.checkAdmin(request.user.data);
    try {
      const chains = await this.chainsService.createChain(createChainsDto);
      return this.responseModel.response(
        chains,
        ResponseStatusCode.CREATED,
        true,
        response,
      );
    } catch (error) {
      return this.responseModel.response(
        error,
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        false,
        response,
      );
    }
  }

  /**
   * @description updateChain will update a particular chain
   * @param updateChainsDto
   * @returns it will return updated chain details
   * @author Jeetanshu Srivastava
   */
  @Patch('/chains')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Chains')
  @ApiOperation({
    summary: 'Update the Existing Chains',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.CHAIN_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async updateChain(
    @Body() updateChainsDto: UpdateChainsDto,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    await this.authService.checkAdmin(request.user.data);
    try {
      const chains = await this.chainsService.createChain(updateChainsDto);
      return this.responseModel.response(
        chains,
        ResponseStatusCode.OK,
        true,
        response,
      );
    } catch (error) {
      return this.responseModel.response(
        error,
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        false,
        response,
      );
    }
  }

  /**
   * @description getChainsForAdmin will return the details of all chains for admin
   * @returns it will return details of all chains
   * @author Jeetanshu Srivastava
   */
  @Get('/admin')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Chains')
  @ApiOperation({
    summary: 'Get all the Chain and their details',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.CHAIN_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async getChainsForAdmin(
    @Response() response,
    @Request() request,
  ): Promise<any> {
    await this.authService.checkAdmin(request.user.data);
    try {
      const chains = await this.chainsService.getChainsForAdmin();
      return this.responseModel.response(
        chains,
        ResponseStatusCode.OK,
        true,
        response,
      );
    } catch (error) {
      return this.responseModel.response(
        error,
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        false,
        response,
      );
    }
  }

  /**
   * @description getChainsForUser will return the details of all chains for user
   * @returns it will return details of all chains
   * @author Jeetanshu Srivastava
   */
  @Get('/user')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Chains')
  @ApiOperation({
    summary: 'Get all the chains and their details',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.CHAIN_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async getChainsForUser(
    @Response() response,
    @Request() request,
  ): Promise<any> {
    await this.authService.checkUser(
      request.user.data,
      request.user.walletAddress,
    );
    try {
      const chains = await this.chainsService.getChainsForUser();
      return this.responseModel.response(
        chains,
        ResponseStatusCode.OK,
        true,
        response,
      );
    } catch (error) {
      return this.responseModel.response(
        error,
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        false,
        response,
      );
    }
  }

  /**
   * @description createToken will create the token
   * @param createTokensDto
   * @returns it will return created token details
   * @author Jeetanshu Srivastava
   */
  @Post('/tokens')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Tokens')
  @ApiOperation({
    summary: 'Create new Tokens',
  })
  @ApiResponse({
    status: ResponseStatusCode.CREATED,
    description: ResponseMessage.TOKEN_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async createToken(
    @Body() createTokensDto: CreateTokensDto,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    await this.authService.checkAdmin(request.user.data);
    try {
      const tokens = await this.chainsService.createToken(createTokensDto);
      return this.responseModel.response(
        tokens,
        ResponseStatusCode.CREATED,
        true,
        response,
      );
    } catch (error) {
      console.log(error);
      return this.responseModel.response(
        error,
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        false,
        response,
      );
    }
  }

  /**
   * @description updateToken will update a particular token
   * @param updateTokenDto
   * @returns it will return updated token details
   * @author Jeetanshu Srivastava
   */
  @Patch('/tokens')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Tokens')
  @ApiOperation({
    summary: 'Update the Existing Tokens',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.TOKEN_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async updateToken(
    @Body() updateTokenDto: UpdateTokensDto,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    await this.authService.checkAdmin(request.user.data);
    try {
      const tokens = await this.chainsService.createChain(updateTokenDto);
      return this.responseModel.response(
        tokens,
        ResponseStatusCode.OK,
        true,
        response,
      );
    } catch (error) {
      return this.responseModel.response(
        error,
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        false,
        response,
      );
    }
  }

  /**
   * @description getTokensForAdmin will return the details of all tokens for admin
   * @returns it will return details of all tokens
   * @author Jeetanshu Srivastava
   */
  @Post('/tokens/admin')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Tokens')
  @ApiOperation({
    summary: 'Get all the Token and their details',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.TOKEN_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async getTokensForAdmin(
    @Body() chainsTokensDto: ChainsTokensDto,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    await this.authService.checkAdmin(request.user.data);
    try {
      const tokens = await this.chainsService.getTokensForAdmin(
        chainsTokensDto,
      );
      return this.responseModel.response(
        tokens,
        ResponseStatusCode.OK,
        true,
        response,
      );
    } catch (error) {
      return this.responseModel.response(
        error,
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        false,
        response,
      );
    }
  }

  /**
   * @description getTokensForUser will return the details of all chains for user
   * @returns it will return details of all tokens
   * @author Jeetanshu Srivastava
   */
  @Post('/tokens/user')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Tokens')
  @ApiOperation({
    summary: 'Get all the Tokens and their details',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.TOKEN_DETAILS,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async getTokensForUser(
    @Body() chainsTokensDto: ChainsTokensDto,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    await this.authService.checkUser(
      request.user.data,
      request.user.walletAddress,
    );
    try {
      const tokens = await this.chainsService.getTokensForUser(chainsTokensDto);
      return this.responseModel.response(
        tokens,
        ResponseStatusCode.OK,
        true,
        response,
      );
    } catch (error) {
      return this.responseModel.response(
        error,
        ResponseStatusCode.INTERNAL_SERVER_ERROR,
        false,
        response,
      );
    }
  }
}
