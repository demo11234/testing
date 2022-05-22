import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseMessage } from 'shared/ResponseMessage';
import { Collection } from 'src/collections/entities/collection.entity';
import { NftItem } from 'src/nft-item/entities/nft-item.entities';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ReportDto } from './dto/report.dto';
import { Report } from './entities/report.entities';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(NftItem)
    private readonly nftItemRepository: Repository<NftItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * @description: This api will let logedin user to report a user, item or collection
   * @param reportDto
   * @returns: success of Report
   * @author: vipin
   */
  async report(req, reportDto: ReportDto): Promise<any> {
    try {
      const report = new Report();

      // finding item and increasing reported count
      if (reportDto.reportType == 0) {
        const item = await this.nftItemRepository.findOne(reportDto.id);
        report.item = item;
        report.collection = null;
        report.user = null;

        const id = reportDto.id;
        item.reported = item.reported + 1;
        await this.nftItemRepository.update({ id }, item);
      }
      // finding collection and increasing reported count
      if (reportDto.reportType == 1) {
        const collection = await this.collectionRepository.findOne(
          reportDto.id,
        );
        report.item = null;
        report.collection = collection;
        report.user = null;

        const id = reportDto.id;
        collection.reported = collection.reported + 1;
        await this.collectionRepository.update({ id }, collection);
      }
      // finding user and increasing reported count
      if (reportDto.reportType == 2) {
        const user = await this.userRepository.findOne(reportDto.id);
        report.item = null;
        report.collection = null;
        report.user = user;

        const id = reportDto.id;
        user.reported = user.reported + 1;
        await this.userRepository.update({ id }, user);
      }

      report.reportedById = req.user.walletAddress;
      report.reportType = reportDto.reportType;
      report.reason = reportDto.reason;
      report.message = reportDto.message;
      report.originalCreatorUrl = reportDto.originalCreatorUrl;

      const data = await this.reportRepository.save(report);

      return data;
    } catch (error) {
      return error;
    }
  }

  async findReported(req, reportDto: ReportDto): Promise<any> {
    try {
      const where: any = { reportedById: req.user.walletAddress, active: true };
      if (reportDto.reportType == 0) {
        where.item = { id: reportDto.id };
      }
      if (reportDto.reportType == 1) {
        where.collection = { id: reportDto.id };
      }
      if (reportDto.reportType == 2) {
        where.user = { id: reportDto.id };
      }

      return await this.reportRepository.find({
        where,
        relations: ['item', 'collection', 'user'],
      });
      //   console.log(data);
    } catch (error) {
      return error;
    }
  }
}
