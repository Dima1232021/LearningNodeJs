import { Request, Response, NextFunction } from "express";
import { HttpExceprion } from "../exceptions/root";

export const errorMiddleware = (error: HttpExceprion, req: Request, res: Response, next: NextFunction) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
    errors: error.errors
  })
};