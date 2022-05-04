import {
  Body,
  Controller,
  Get,
  Param,
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
import { CreateTokensDto } from '../token/dto/create-tokens.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';
import { TokenService } from './token.service';

@Controller('tokens')
export class TokenController {
  constructor(
    private readonly responseModel: ResponseModel,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * @description createToken will create the token
   * @param createTokensDto
   * @returns it will return created token details
   * @author Jeetanshu Srivastava
   */
  @Post()
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
      const tokens = await this.tokenService.createToken(createTokensDto);
      return this.responseModel.response(
        tokens,
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
   * @description updateToken will update a particular token
   * @param updateTokenDto
   * @returns it will return updated token details
   * @author Jeetanshu Srivastava
   */
  @Patch()
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
      const tokens = await this.tokenService.updateToken(updateTokenDto);
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
  @Get('/admin/:chainId')
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
    @Param('chainId') chainId: string,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    await this.authService.checkAdmin(request.user.data);
    try {
      const tokens = await this.tokenService.getTokens(chainId);
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
  @Post('/user/:chainId')
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
  async getTokensForUser(
    @Param('chainId') chainId: string,
    @Response() response,
  ): Promise<any> {
    try {
      const tokens = await this.tokenService.getTokens(chainId);
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
