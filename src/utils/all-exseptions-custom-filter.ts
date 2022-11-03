import { HttpException, HttpStatus } from '@nestjs/common';
import { CastError } from 'src/custom-exceptions/cast-error.exception';
import { NonSchemaField } from 'src/custom-exceptions/non-schema.exception';
import { ValidationError } from 'src/custom-exceptions/validator-error.exception';

export const catchError = (err, service) => {
  if (err?.name === 'StrictModeError') throw new NonSchemaField(err, service) //name is js basic property, StrictModeError - mongoose's schema strict option's error
  if (err?.name === 'CastError') throw new CastError(err) // to work properly shema and interface type must be same
  if(err?.name === 'ValidationError') throw new ValidationError(err, service) // for missing required fields
  if (err?.name === 'MongoServerError' && err?.code === 11000) throw new ValidationError(err, service)
  throw new HttpException(`Unhandled exception in ${service} service. Error name: ${err.name}. Error text: ${err}`, HttpStatus.INTERNAL_SERVER_ERROR);
}