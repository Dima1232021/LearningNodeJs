import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { ValidationSchema } from '../schema/users';
import { z } from 'zod';

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const updateUserPreferences = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const { firstName, lastName, currentPassword, newPassword, confirmNewPassword } = req.body;

  const updateData: any = {};
  const errors: Record<string, string> = {};

  try {
    ValidationSchema.parse({ firstName, lastName });
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path[0] === "firstName") {
          errors.firstName = err.message;
        }
        if (err.path[0] === "lastName") {
          errors.lastName = err.message;
        }
      });
    }
  }

  if (firstName && !errors.firstName && firstName !== user!.firstName) {
    updateData.firstName = capitalizeFirstLetter(firstName);
  }

  if (lastName && !errors.lastName && lastName !== user!.lastName) {
    updateData.lastName = capitalizeFirstLetter(lastName);
  }

  if (updateData.firstName || updateData.lastName) {
    updateData.userName = `${updateData.firstName || user!.firstName} ${updateData.lastName || user!.lastName}`;
  }

  if (currentPassword || newPassword || confirmNewPassword) {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      errors.password = "All password fields are required";
    } else if (!compareSync(currentPassword, user!.password)) {
      errors.password = "Current password is incorrect";
    } else if (newPassword !== confirmNewPassword) {
      errors.password = "New password and confirmation do not match";
    } else {
      try {
        ValidationSchema.parse({ newPassword, confirmNewPassword });
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            if (err.path[0] === "newPassword") {
              errors.newPassword = err.message;
            }
            if (err.path[0] === "confirmNewPassword") {
              errors.confirmNewPassword = err.message;
            }
          });
        }
      }

      if (!errors.newPassword && !errors.confirmNewPassword && !compareSync(newPassword, user!.password)) {
        updateData.password = hashSync(newPassword, 10);
      } else if (compareSync(newPassword, user!.password)) {
        errors.newPassword = "New password must be different from the current password";
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: errors,
      errorCode: ErrorCode.UNPROCESSABLE_ENTITY,
    });
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(200).json({
      message: "No changes detected, nothing to update",
    });
  }

  if (Object.keys(updateData).length > 0) {
    await prismaClient.user.update({
      where: { id: user!.id },
      data: updateData,
    });
  }

  res.status(200).json({ message: "User preferences updated successfully" });
};
