import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class ProductsService {
  constructor(private readonly httpService: HttpService) {}
  create(createProductDto: CreateProductDto) {
    console.log('createProductDto', createProductDto);
    return 'This action adds a new product';
  }

  async findAll() {
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          'https://cdn.contentful.com/spaces/9xs1613l9f7v/environments/master/entries?access_token=I-ThsT55eE_B3sCUWEQyDT4VqVO3x__20ufuie9usns&content_type=product',
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error(error.response.data);
            throw 'An error happened!';
          }),
        ),
    );
    console.log(data);
    return `${JSON.stringify(data)}`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    console.log(updateProductDto);
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
