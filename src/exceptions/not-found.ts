import { HttpExceprion, ErrorCode } from "./root";

export class NotFoundException extends HttpExceprion {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode, 404, null)
  }

}