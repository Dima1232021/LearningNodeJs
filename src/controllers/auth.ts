import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { JWT_SECRET, JWT_EXPIRATION } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { SignUpSchema, ForgotPasswordSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";
import { sendEmail } from "../utils/sendEmail";

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  SignUpSchema.parse(req.body)
  let { email, password, firstName, lastName } = req.body;

  firstName = capitalizeFirstLetter(firstName);
  lastName = capitalizeFirstLetter(lastName);
  const userName = `${firstName} ${lastName}`;

  let user = await prismaClient.user.findFirst({where: {email: email}});

  if(user) {
    return next(new BadRequestsException('User already exists!', ErrorCode.USER_ALREADY_EXISTS));
  }

  user = await prismaClient.user.create({
    data: {
      userName,
      firstName,
      lastName,
      email,
      password: hashSync(password, 10)
    }
  });
  res.status(200).json({});
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({where: {email: email}});

  if(!user) {
    return next(new NotFoundException('User does not exists!', ErrorCode.USER_NOT_FOUND));
  }

  if(!compareSync(password, user.password)) {
    return next(new BadRequestsException('Incorrect password!', ErrorCode.INCORRECT_PASSWORD));
  }

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  await prismaClient.revokedToken.deleteMany({
    where: {
      revokedAt: {
        lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
  });
  
  res.status(202).json({ token });
};

export const me = async (req: Request, res: Response) => {
  const newToken = jwt.sign(
    { userId: req.user!.id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
  res.json({ user: req.user, token: newToken });
};

export const logout = async (req: Request, res: Response) => {
  await prismaClient.revokedToken.create({
    data: {
      token: req.token!,
    },
  });

  res.status(200).json({});
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = ForgotPasswordSchema.parse(req.body);

  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) {
    return next(new NotFoundException("User with this email does not exist", ErrorCode.USER_NOT_FOUND));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const hashedPassword = hashSync(resetCode, 10);

  await prismaClient.user.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });

  await sendEmail({
    to: email,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${resetCode}`,
  });

  res.status(200).json({
    message: "Password reset successfully. Please check your email for the reset code.",
  });
};