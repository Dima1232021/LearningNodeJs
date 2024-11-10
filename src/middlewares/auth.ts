import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { prismaClient } from "..";

import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { JWT_SECRET } from "../secrets";


const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
  }

  const isRevoked = await prismaClient.revokedToken.findFirst({where: { token }});
  if (isRevoked) {
    return next(new UnauthorizedException("Token is revoked", ErrorCode.UNAUTHORIZED));
  }

  try {
    const payload: {userId: number} = jwt.verify(token, JWT_SECRET) as any;
    const user = await prismaClient.user.findFirst({where: {id: payload.userId}});

    if(!user) {
      return next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
    } 

    req.user= user;
    req.token = token;
    next();
  } catch (error) {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED, error))
  }
};

export default authMiddleware;