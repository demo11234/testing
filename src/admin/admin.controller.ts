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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { GetAdmin } from './decorators/get-user.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';

import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { JwtAuthGuard } from './gaurds/jwt-auth.guard';
import { LocalAuthGuard } from './gaurds/local-auth.gaurd';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  /**
   *
   * @param req Data coming from user wrapped in Req
   * @returns
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req): Promise<any> {
    return await this.adminService.login(req.user);
  }

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto): Promise<any> {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.adminService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<any> {
    return await this.adminService.updateAdmin(id, updateAdminDto);
  }

  /**
   * @description get profile data of currently logged in admin
   * @param admin
   * @returns admin who is logged in
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getUser(@GetAdmin() admin: Admin): Promise<Admin> {
    return admin;
  }
}
