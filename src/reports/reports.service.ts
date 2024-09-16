import { Injectable } from '@nestjs/common';

import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  deletedProductsByPercentage() {
    return 'This lists the deleted products by percentage';
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    console.log(updateReportDto);
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
