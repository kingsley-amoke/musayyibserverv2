import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

export class CustomError {
  static badRequestError(message: string) {
    return new HttpException(message, HttpStatus.BAD_REQUEST);
  }

  static axiosError(message: string) {
    return new HttpException(message, HttpStatus.REQUEST_TIMEOUT);
  }

  static serverError(message: string) {
    return new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  static insufficientFundError = new HttpException(
    'Insufficient Funds',
    HttpStatus.PAYMENT_REQUIRED,
  );

  static notFoundError(message: string) {
    return new HttpException(message, HttpStatus.NOT_FOUND);
  }

  static unAuthorizedError = new UnauthorizedException();
}
