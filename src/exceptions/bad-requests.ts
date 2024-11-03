import { HttpExceprion, ErrorCode } from "./root";

export class BadRequestsException extends HttpExceprion {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 400, null)
  }

}