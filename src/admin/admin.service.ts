import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { argon2hash, argon2verify } from './argon2/argon2';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

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
      if (error.code === '23505')
        throw new ConflictException('Email already exists');
      else throw new InternalServerErrorException();
    }
  }

  /**
   *
   * @param admin
   * @returns  {token}
   * @author Mohan Chaudhari
   */
  async login(admin: any) {
    const payload = { sub: admin.username };
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
      if (isUpdated) return { status: 200, msg: 'Admin updated succesfully' };
    } catch (error) {
      throw new BadRequestException('Bad request for updating Admin');
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
      console.log('rdhdrhd', admin);
      console.log('%%%', admin.password, password);

      if (!admin) throw new NotFoundException('Admin not found**');

      if (admin && argon2verify(admin.password, password)) return admin;
    } catch (error) {
      throw new BadRequestException('Bad request in ValidateCustomer');
    }
  }
  async findAll(): Promise<Admin[]> {
    try {
      return await this.adminRepository.find({});
    } catch (error) {
      throw new InternalServerErrorException('Error in fetching the records');
    }
  }
}
