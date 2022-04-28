import { Injectable, Response } from '@nestjs/common';

@Injectable()
export class ResponseModel {
  response(message: any, status: number, success: boolean,@Response() response) {
    return {
      message,
      status,
      success
    };
  }
}
