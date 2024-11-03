import { HttpExceprion } from "./root";

export class InternalException extends HttpExceprion {
  constructor(message: string, errors: any, errorCode: number) {
    super(message, errorCode, 500, errors)
  }
}