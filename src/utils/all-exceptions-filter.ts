import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseRpcExceptionFilter } from '@nestjs/microservices';

//https://docs.nestjs.com/microservices/exception-filters
//хз
@Catch()
export class AllExceptionsFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    return super.catch(exception, host);
  }
 // throw new HttpException('AllExceptionsFilter', HttpStatus.INTERNAL_SERVER_ERROR);
}