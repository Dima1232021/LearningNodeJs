import { NextFunction, Request, Response } from "express";

export const updateUserPreferences = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({});
};