import dotenv from 'dotenv';

dotenv.config({path: '.env'});

export const PORT = process.env.PORT!;
export const JWT_SECRET = process.env.JWT_SECRET!
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION!;

export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT!;
export const SMTP_USER = process.env.SMTP_USER!;
export const SMTP_PASS = process.env.SMTP_PASS!;
export const SMTP_FROM = process.env.SMTP_FROM!;