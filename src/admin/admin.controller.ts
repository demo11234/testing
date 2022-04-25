import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
  Request
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { GetAdmin } from './decorators/get-user.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.gaurd';
import { AuthService } from 'src/auth/auth.service';

@Controller('admin')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService
  ) {}
  /**
   * @description login admin
   * @param req Data coming from user wrapped in Req
   * @returns  token for login
   * @author Mohan
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({ description: 'login as admin' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiBody({ required: true, type: LoginAdminDto })
  async login(@Req() req): Promise<any> {
    return await this.adminService.login(req.user);
  }
  /**
   *@description creating admin account
   * @param createAdminDto
   * @returns admin created and status code
   * @author Mohan Chaudhari
   */
  @Post()
  @ApiOkResponse({
    description: 'creates the account and returns created admin',
  })
  @ApiUnauthorizedResponse({
    description: 'In case admin is not logged in',
  })
  @ApiConflictResponse({
    description: 'In case of email already exists in the database',
  })
  @ApiBearerAuth()
  async create(@Body() createAdminDto: CreateAdminDto): Promise<any> {
    return this.adminService.create(createAdminDto);
  }
  /**
   * @description get all admins
   * @returns array of admins
   * @author Mohan
   *
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'get all Admins' })
  @ApiUnauthorizedResponse({ description: 'In case admin is not logged in' })
  @ApiBearerAuth()
  async findAll(@Req() req) {
    await this.authService.checkAdmin(req.user.data);
    return this.adminService.findAll();
  }
  /**
   * @description upadtes admin
   * @param id of admin
   * @param updateAdminDto
   * @returns status and string "Admin updated succesfully"
   * @author Mohan
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'Update Admin Data' })
  @ApiUnauthorizedResponse({ description: 'In case admin is not logged in' })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Req() req
  ): Promise<any> {
    await this.authService.checkAdmin(req.user.data);
    return await this.adminService.updateAdmin(id, updateAdminDto);
  }

  /**
   * @description get profile data of currently logged in admin
   * @param admin
   * @returns admin who is logged in
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Get data about current logged in admin',
    type: Admin,
  })
  @ApiUnauthorizedResponse({ description: 'In case admin is not logged in' })
  @ApiBearerAuth()
  async getUser(@GetAdmin() admin: Admin, @Req() req): Promise<Admin> {
    await this.authService.checkAdmin(req.user.data);
    return admin;
  }
}
