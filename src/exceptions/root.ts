// message, status code, error codes, error

export class HttpExceprion extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  errors: any;

  constructor(message: string, errorCode: ErrorCode, statusCode: number, errors: any) {
    super(message)
    this.message = message
    this.errorCode = errorCode
    this.statusCode = statusCode
    this.errors = errors
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 4041,
  USER_ALREADY_EXISTS = 4091,
  INCORRECT_PASSWORD = 4011,
  UNPROCESSABLE_ENTITY = 4220,
  INTERNAL_EXCEPTION = 5000,
  UNAUTHORIZED = 4010,
}