import { HttpException, HttpStatus, BadRequestException } from "@nestjs/common";

export class ValidationError extends HttpException {
  constructor(err, service){
      const message = `(in ${service} service): ${err?.message} `
      super(message, HttpStatus.BAD_REQUEST) //400
  }
}