import { NextFunction, Request, Response, RequestHandler } from "express"

import { ErrorCode, HttpExceprion } from "./exceptions/root"
import { InternalException } from "./exceptions/internal-exception"

export const errorHandler = (method: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next)
    } catch (error: any) {
      let exception: HttpExceprion;
      if(error instanceof HttpExceprion) {
        exception = error;
      } else {
        exception = new InternalException('Something went wrong!', error, ErrorCode.INTERNAL_EXCEPTION)
      }
      next(exception)
    }
  }
}