import { HttpExceprion } from "./root";


export class UnprocessableEntity extends HttpExceprion {
  constructor(error: any, message: string, errorCode: number) {
    super(message, errorCode, 422, error)
  } 
}