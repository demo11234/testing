import {
  Controller,
  Post,
  Body,
  Patch,
  Response,
  Request,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WalletAddressDto, UserNameDto } from './dto/get-user.dto';

import { ResponseModel } from 'src/responseModel';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { ResponseMessage } from 'shared/ResponseMessage';
import { AuthService } from 'src/auth/auth.service';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SignedUrlDto } from './dto/signed-url.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseModel: ResponseModel,
    private readonly authService: AuthService,
  ) {}

  /**
   * @description createUser will create User if user with given wallet address doesn't exist
   * @param createUserDto
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  @ApiTags('User Module')
  @ApiOperation({
    summary:
      'Login User with given Wallet Address or Create new Account with given Wallet Address',
  })
  @ApiResponse({
    status: ResponseStatusCode.OK,
    description: ResponseMessage.USER_LOGGED_IN,
  })
  @ApiResponse({
    status: ResponseStatusCode.CREATED,
    description: ResponseMessage.USER_CREATED,
  })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Response() response,
  ): Promise<any> {
    try {
      let user = await this.userService.findUser(createUserDto);
      if (user) {
        const details = await this.authService.createUserToken(
          createUserDto.walletAddress,
          user,
        );
        return this.responseModel.response(
          details,
          ResponseStatusCode.OK,
          true,
          response,
        );
      } else {
        user = await this.userService.createUser(createUserDto);
        const details = await this.authService.createUserToken(
          createUserDto.walletAddress,
          user,
        );
        return this.responseModel.response(
          details,
          ResponseStatusCode.CREATED,
          true,
          response,
        );
      }
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
   * @description updateUser will update the user details
   * @param UpdateUserDto
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiTags('User Module')
  @ApiOperation({ summary: 'Update User Details who is currenlty Logged In' })
  @ApiResponse({
    status: ResponseStatusCode.CONFLICT,
    description: ResponseMessage.USER_EXISTS_WITH_GIVEN_EMAIL_ADDRESS,
  })
  @ApiResponse({
    status: ResponseStatusCode.CONFLICT,
    description: ResponseMessage.USER_EXISTS_WITH_GIVEN_USER_NAME,
  })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.USER_DOES_NOT_EXISTS_WITH_GIVEN_WALLET_ADDRESS,
  })
  @ApiResponse({ status: ResponseStatusCode.OK, description: 'User Details' })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Response() response,
    @Request() request,
  ): Promise<any> {
    try {
      await this.authService.checkUser(
        request.user.data,
        request.user.walletAddress,
      );

      const userDetails = await this.userService.findUser({
        walletAddress: request.user.walletAddress,
      });

      const { email, userName } = updateUserDto;

      if (email && userDetails.email != email) {
        const user = await this.userService.findUserByEmail(email);
        if (user) {
          return this.responseModel.response(
            ResponseMessage.USER_EXISTS_WITH_GIVEN_EMAIL_ADDRESS,
            ResponseStatusCode.CONFLICT,
            false,
            response,
          );
        }
      }

      if (userName && userDetails.userName != userName) {
        const user = await this.userService.findUserByUserName(userName);
        if (user) {
          return this.responseModel.response(
            ResponseMessage.USER_EXISTS_WITH_GIVEN_USER_NAME,
            ResponseStatusCode.CONFLICT,
            false,
            response,
          );
        }
      }

      const user = await this.userService.update(
        request.user.walletAddress,
        updateUserDto,
      );
      if (!user) {
        return this.responseModel.response(
          ResponseMessage.USER_DOES_NOT_EXISTS_WITH_GIVEN_WALLET_ADDRESS,
          ResponseStatusCode.NOT_FOUND,
          false,
          response,
        );
      } else {
        return this.responseModel.response(
          user,
          ResponseStatusCode.OK,
          true,
          response,
        );
      }
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
   * @description getUserDetailsByUserName will fetch the user details with given user name
   * @param userName
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  @ApiTags('User Module')
  @ApiOperation({ summary: 'Get User Details with given User Name' })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.USER_DOES_NOT_EXISTS_WITH_GIVEN_USERNAME,
  })
  @ApiResponse({ status: ResponseStatusCode.OK, description: 'User Details' })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  @Post('/userdetails/username')
  async getUserDetailsByUserName(
    @Body() userNameDto: UserNameDto,
    @Response() response,
  ): Promise<any> {
    try {
      const { userName } = userNameDto;
      const user = await this.userService.findUserByUserName(userName);
      if (!user) {
        return this.responseModel.response(
          ResponseMessage.USER_DOES_NOT_EXISTS_WITH_GIVEN_USERNAME,
          ResponseStatusCode.NOT_FOUND,
          false,
          response,
        );
      } else {
        return this.responseModel.response(
          user,
          ResponseStatusCode.OK,
          true,
          response,
        );
      }
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
   * @description getUserDetailsByWalletAddress will fetch the user details with given wallet address
   * @param createUserDto
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  @ApiTags('User Module')
  @ApiOperation({ summary: 'Get User Details with given Wallet Address' })
  @ApiResponse({
    status: ResponseStatusCode.NOT_FOUND,
    description: ResponseMessage.USER_DOES_NOT_EXISTS_WITH_GIVEN_WALLET_ADDRESS,
  })
  @ApiResponse({ status: ResponseStatusCode.OK, description: 'User Details' })
  @ApiResponse({
    status: ResponseStatusCode.INTERNAL_SERVER_ERROR,
    description: ResponseMessage.INTERNAL_SERVER_ERROR,
  })
  @ApiBearerAuth()
  @Post('/userdetails/walletaddress')
  async getUserDetailsByWalletAddress(
    @Body() walletAddressDto: WalletAddressDto,
    @Response() response,
  ): Promise<any> {
    try {
      const user = await this.userService.findUser(walletAddressDto);
      if (!user) {
        return this.responseModel.response(
          ResponseMessage.USER_DOES_NOT_EXISTS_WITH_GIVEN_WALLET_ADDRESS,
          ResponseStatusCode.NOT_FOUND,
          false,
          response,
        );
      } else {
        return this.responseModel.response(
          user,
          ResponseStatusCode.OK,
          true,
          response,
        );
      }
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
   * @description it will genrate singed url for s3 bucket
   * @param SignedUrlDto
   * @returns it will return signed url
   * @author Vipin
   */
  @ApiTags('User Module')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get pre-signed url with given filename and filetype',
  })
  @ApiResponse({ status: ResponseStatusCode.OK, description: 'Pre-Signed Url' })
  @ApiBearerAuth()
  @Post('/getPresignedURL')
  async getPresignedURL(@Body() signedUrlDto: SignedUrlDto): Promise<any> {
    const url = await this.userService.getPresignedURL(signedUrlDto);
    return url;
  }
}
