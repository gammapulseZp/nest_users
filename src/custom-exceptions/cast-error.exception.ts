import { HttpException, HttpStatus } from "@nestjs/common";

export class CastError extends HttpException {
  constructor(err){
      const message = `${err?.path} supposed to have a ${err?.kind} type`
      super(message, HttpStatus.INTERNAL_SERVER_ERROR) //500 basic
  }
}