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
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseMessage } from 'shared/ResponseMessage';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.gaurd';
import { AdminService } from './admin.service';
import { GetAdmin } from './decorators/get-user.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateCategoryDto } from './dto/create-categoty.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Admin } from './entities/admin.entity';
import { Category } from './entities/categories.entity';

@Controller('admin')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}
  /**
   * @description login admin
   * @param req Data coming from user wrapped in Req
   * @returns  token for login
   * @author Mohan
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOkResponse({ description: ResponseMessage.LOGIN_ADMIN })
  @ApiOperation({ summary: 'Admin login' })
  @ApiUnauthorizedResponse({ description: ResponseMessage.INVALID_CRED })
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
    description: ResponseMessage.CREATE_DESC_ADMIN,
  })
  @ApiUnauthorizedResponse({
    description: ResponseMessage.ADMIN_NOT_LOGGED_IN,
  })
  @ApiConflictResponse({
    description: ResponseMessage.UNIQUE_CONSTRAINTS_EMAIL,
  })
  @ApiOperation({ summary: 'Create Admin' })
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
  @ApiOkResponse({ description: ResponseMessage.ALL_ADMINS })
  @ApiUnauthorizedResponse({ description: ResponseMessage.ADMIN_NOT_LOGGED_IN })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all Admins' })
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
  @ApiOkResponse({ description: ResponseMessage.UPDATE_ADMIN })
  @ApiOperation({ summary: 'Update Admin by id' })
  @ApiUnauthorizedResponse({ description: ResponseMessage.ADMIN_NOT_LOGGED_IN })
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Req() req,
  ): Promise<any> {
    await this.authService.checkAdmin(req.user.data);
    return await this.adminService.updateAdmin(id, updateAdminDto);
  }

  /**
   * @description get profile data of currently logged in admin
   * @param admin
   * @returns admin who is logged in
   * @author Mohan
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: ResponseMessage.LOGGED_IN_ADMIN,
    type: Admin,
  })
  @ApiUnauthorizedResponse({ description: ResponseMessage.ADMIN_NOT_LOGGED_IN })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Admin profile of logged in admin' })
  async getAdminProfile(@GetAdmin() admin: Admin, @Req() req): Promise<Admin> {
    await this.authService.checkAdmin(req.user.data);

    return this.adminService.getAdminProfile(admin.username);
  }

  /**
   * @description create category
   * @param createCategoryDto
   * @returns status and created category
   * @author Mohan
   */
  @Post('createCategory')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: ResponseMessage.DESC_CREATE_CATEGORY,
  })
  @ApiUnauthorizedResponse({
    description: ResponseMessage.ADMIN_NOT_LOGGED_IN,
  })
  @ApiConflictResponse({
    description: ResponseMessage.UNIQUE_CONSTRAINTS_CATEGORY,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'create category' })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetAdmin() admin: Admin,
    @Req() req,
  ): Promise<any> {
    await this.authService.checkAdmin(req.user.data);
    return this.adminService.createCategory(createCategoryDto, admin);
  }
  /**
   * @description delete category
   * @param categoryId
   * @returns status for deleting category
   * @author Mohan
   */
  @Delete('deleteCategory/:categoryId')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: ResponseMessage.DELETE_CATEGORY })
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiUnauthorizedResponse({ description: ResponseMessage.ADMIN_NOT_LOGGED_IN })
  @ApiBearerAuth()
  async deleteCategory(@Param('categoryId') categoryId: string, @Req() req) {
    await this.authService.checkAdmin(req.user.data);
    return this.adminService.deleteCategory(categoryId);
  }
  /**
   * @description update category
   * @param categoryId
   * @param updateCategoryDto
   * @returns status and msg for updation
   * @author Mohan
   */
  @Patch('updateCategory/:categoryId')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: ResponseMessage.UPDATE_CATEGORY })
  @ApiUnauthorizedResponse({ description: ResponseMessage.ADMIN_NOT_LOGGED_IN })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'update category' })
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req,
  ): Promise<any> {
    await this.authService.checkAdmin(req.user.data);
    return this.adminService.updateCategory(categoryId, updateCategoryDto);
  }

  /**
   * @description GET all categories
   * @returns Array of all categories
   * @author Mohan
   */

  @Get('allCategories')
  @ApiOkResponse({ description: ResponseMessage.ALL_CATEGORIES })
  @ApiUnauthorizedResponse({ description: ResponseMessage.ADMIN_NOT_LOGGED_IN })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find All categories' })
  async findAllCategories(@Req() req) {
    await this.authService.checkAdmin(req.user.data);
    return this.adminService.findAllCategories();
  }
  /**
   * @description get category by Id
   * @param categoryId
   * @returns category
   */
  @Get('category/:categoryId')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: ResponseMessage.CATEGORY_BY_ID,
  })
  @ApiUnauthorizedResponse({ description: ResponseMessage.ADMIN_NOT_LOGGED_IN })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get category by Id' })
  async getCategoryById(
    @Param('categoryId') categoryId: string,
    @Req() req,
  ): Promise<Category> {
    await this.authService.checkAdmin(req.user.data);
    return this.adminService.getCategoryById(categoryId);
  }
}
