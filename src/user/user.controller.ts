import {
  Controller,
  Post,
  Body,
  Patch,
  Response
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseModel } from 'src/responseModel';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';
import { ResponseMessage } from 'shared/ResponseMessage';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseModel: ResponseModel,
  ) {}

  /**
   * @description createUser will create User if user with given wallet address doesn't exist
   * @param createUserDto
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto,@Response() response): Promise<any> {
    let user = await this.userService.findUser(createUserDto);
    if(user) {
      return this.responseModel.response(user, ResponseStatusCode.OK, true, response);
    }
    else {
      user = await this.userService.createUser(createUserDto);
      return this.responseModel.response(user,ResponseStatusCode.CREATED, true, response);
    }
  }

  /**
   * @description updateUser will update the user details
   * @param UpdateUserDto
   * @returns it will return user details
   * @author Jeetanshu Srivastava
   */
  @Patch()
  async updateUser(@Body() updateUserDto: UpdateUserDto,@Response() response): Promise<any> {
    try {
      const user = await this.userService.update(updateUserDto);
      if(!user) {
        return this.responseModel.response(ResponseMessage.USER_DOSE_NOT_EXISTS_WITH_GIVEN_WALLET_ADDRESS, ResponseStatusCode.NOT_FOUND, false, response);
      }
      else {
        return this.responseModel.response(user, ResponseStatusCode.OK, true, response);
      }
    } catch (error) {
      console.log(error);
      return this.responseModel.response(error, ResponseStatusCode.INTERNAL_SERVER_ERROR, false, response);
    }
  }
}
