import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { argon2hash, argon2verify } from './argon2/argon2';
import { Constants } from 'shared/Constants';
import { CreateCategoryDto } from './dto/create-categoty.dto';
import { Category } from './entities/categories.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseMessage } from 'shared/ResponseMessage';
import { ResponseStatusCode } from 'shared/ResponseStatusCode';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit(): Promise<void> {
    const isAdminPresent = await this.adminRepository.findOne({
      username: process.env.ADMIN_USERNAME,
    });

    if (!isAdminPresent) {
      const admin = {
        firstName: process.env.ADMIN_FIRST_NAME,
        lastName: process.env.ADMIN_LAST_NAME,
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
      };

      await this.create(admin);
    }
  }

  /**
   *
   * @param createAdminDto Accepts username and passwrod
   * @returns {status, admin created}
   * @author Mohan Chaudhari
   */
  async create(createAdminDto: CreateAdminDto) {
    try {
      let admin = new Admin();
      admin.firstName = createAdminDto.firstName;
      admin.lastName = createAdminDto.lastName;
      admin.username = createAdminDto.username;
      admin.password = await argon2hash(createAdminDto.password); //await bcrypt.hash(createAdminDto.password, 8);
      admin.active = true;

      admin = await this.adminRepository.save(admin);
      return { status: HttpStatus.CREATED, admin };
    } catch (error) {
      if (error.code === ResponseStatusCode.UNIQUE_CONSTRAINTS)
        throw new ConflictException(ResponseMessage.UNIQUE_CONSTRAINTS_EMAIL);
      // else throw new InternalServerErrorException();
    }
  }

  /**
   *
   * @param admin
   * @returns  {token}
   * @author Mohan Chaudhari
   */
  async login(admin: any) {
    const bufferObj = Buffer.from(Constants.ADMIN, 'utf8');
    const base64String = bufferObj.toString('base64');

    const payload = {
      sub: admin.username,
      data: base64String,
    };
    return { token: this.jwtService.sign(payload) };
  }
  /**
   *
   * @param id
   * @param updateAdminDto
   * @returns status 200 if successful updation
   */
  async updateAdmin(id, updateAdminDto: UpdateAdminDto): Promise<any> {
    try {
      const isUpdated = await this.adminRepository.update(
        { id },
        updateAdminDto,
      );
      if (isUpdated)
        return {
          status: HttpStatus.OK,
          msg: ResponseMessage.MSG_UPDATE_SUCCESS,
        };
    } catch (error) {
      throw new BadRequestException(ResponseMessage.BAD_REQUEST_UPDATE_ADMIN);
    }
  }
  /**
   *
   * @param username
   * @param password
   * @returns admin
   * @author Mohan Chaudhari
   */
  async validateCustomer(username, password): Promise<Admin> {
    try {
      const admin = await this.adminRepository.findOne({ username });

      if (!admin) throw new NotFoundException(ResponseMessage.ADMIN_NOT_FOUND);

      if (admin && argon2verify(admin.password, password)) return admin;
    } catch (error) {
      throw new BadRequestException(ResponseMessage.BAD_REQUEST_VALIDATE);
    }
  }
  /**
   *
   * @returns array of admins
   */
  async findAll(): Promise<Admin[]> {
    try {
      return await this.adminRepository.find({});
    } catch (error) {
      throw new InternalServerErrorException(ResponseMessage.FETCH_ERROR);
    }
  }
  /**
   *
   * @param createCategoryDto
   * @returns status and created category
   */
  async createCategory(createCategoryDto: CreateCategoryDto, { username }) {
    try {
      let category = new Category();

      category.categoryName = createCategoryDto.categoryName;
      category.categoryImageUrl = createCategoryDto.categoryImageUrl;
      category.categorySlug = createCategoryDto.categoryName.replace(/ /g, '-'); //string.replace(/ /g, "")
      category.categoryStatus = true;
      category.createdBy = username;
      category = await this.categoryRepository.save(category);
      return { status: HttpStatus.CREATED, category };
    } catch (error) {
      if (error.code === ResponseStatusCode.UNIQUE_CONSTRAINTS)
        throw new ConflictException(
          ResponseMessage.UNIQUE_CONSTRAINTS_CATEGORY,
        );
      else throw new InternalServerErrorException();
    }
  }

  /**
   *
   * @param id category id to delete
   * @returns status, msg
   * @author Mohan
   */
  async deleteCategory(id) {
    try {
      const deleted = await this.categoryRepository.delete({ id });

      if (deleted.affected === 1)
        return { status: HttpStatus.OK, msg: ResponseMessage.DELETE_SUCCESS };
      else throw new NotFoundException(ResponseMessage.NOT_FOUND_CATEGORY);
    } catch (error) {
      throw new BadRequestException(
        ResponseMessage.BAD_REQUEST_DELETE_CATEGORY,
      );
    }
  }

  /**
   *
   * @param id
   * @param updateCategoryDto
   * @returns status 200 if successful updation
   * @author Mohan
   */
  async updateCategory(id, updateCategoryDto: UpdateCategoryDto) {
    try {
      const isUpdated = await this.categoryRepository.update(
        { id },
        updateCategoryDto,
      );
      if (isUpdated)
        return {
          status: HttpStatus.OK,
          msg: ResponseMessage.UPDATE_SUCCESS_CATEGORY,
        };
      else throw new NotFoundException();
    } catch (error) {
      throw new BadRequestException(
        ResponseMessage.BAD_REQUEST_UPDATE_CATEGORY,
      );
    }
  }
  /**
   *
   * @returns array of admins
   * @author Mohan
   */
  async findAllCategories(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({});
    } catch (error) {
      throw new InternalServerErrorException(ResponseMessage.FETCH_ERROR);
    }
  }
  /**
   * @description getting category by Id
   * @param id
   * @returns category from database
   * @author Mohan
   */
  async getCategoryById(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({ id });
      if (!category)
        throw new NotFoundException(ResponseMessage.NOT_FOUND_CATEGORY);
      return category;
    } catch (error) {
      throw new InternalServerErrorException(ResponseMessage.FETCH_ERROR);
    }
  }
  /**
   * @description get details of currently logged in admin
   * @param username
   * @returns data of logged in admin
   */
  async getAdminProfile(username: string): Promise<Admin> {
    try {
      const admin = this.adminRepository.findOne({ username });
      if (!admin) throw new NotFoundException(ResponseMessage.NOT_FOUND);
      return admin;
    } catch (error) {
      throw new InternalServerErrorException(ResponseMessage.FETCH_ERROR);
    }
  }
}
