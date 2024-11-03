import { HttpExceprion, ErrorCode } from "./root";

export class UnauthorizedException extends HttpExceprion {
  constructor(message: string, errorCode: ErrorCode, errors?: any) {
    super(message, errorCode, 401, errors)
  }

}