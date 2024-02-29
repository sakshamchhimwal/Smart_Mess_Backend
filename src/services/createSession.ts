import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { JWTLoadData } from '../Interface/interfaces';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_KEY;

export const createSession = (data: JWTLoadData) => {
  const token = jwt.sign(data, JWT_SECRET as string, {
    expiresIn: '30d',
  });
  return token;
}
