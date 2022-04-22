import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { AdminService } from '../admin.service';
import { Admin } from '../entities/admin.entity';
/**
 * jwt strategy for passport
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly adminService: AdminService,
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  /**
   * Validating payload
   * @param payload
   * @returns admin
   * @author Mohan Chaudhari
   */
  async validate(payload: any): Promise<any> {
    console.log(payload.sub);

    const admin = await this.adminRepository.findOne({ username: payload.sub });

    if (!admin) {
      throw new UnauthorizedException(
        'The user belonging to this token does no longer exist.',
      );
    }
    return admin;
  }
}
