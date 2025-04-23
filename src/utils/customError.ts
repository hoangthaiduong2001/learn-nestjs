import { BadRequestException, ValidationError } from '@nestjs/common';

function customValidationExceptionFactory(errors: ValidationError[]) {
  const formattedErrors = errors.map(err => ({
    field: err.property,
    errors: Object.values(err.constraints || {})[0],
  }));

  return new BadRequestException({
    statusCode: 400,
    message: 'Validation failed',
    errors: formattedErrors,
  });
}

export default customValidationExceptionFactory;
