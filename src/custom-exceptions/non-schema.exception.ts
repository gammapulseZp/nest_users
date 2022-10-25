import { HttpException, HttpStatus } from "@nestjs/common";

//applied only if @Prop({required: true is stated in schema})
export class NonSchemaField extends HttpException {
    constructor(err, service) {
        const message = `${err?.path} is not present in schema for ${service}`
        super(message, HttpStatus.INTERNAL_SERVER_ERROR) //500 basic
    }
}

