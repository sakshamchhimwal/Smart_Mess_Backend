import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { JWTLoadData } from '../Interface/interfaces';

const JWT_SECRET = process.env.JWT_SECRET;

export const createSession = (data: JWTLoadData,res: Response) => {
  const token = jwt.sign(data, JWT_SECRET as string);
  // cookie with 1hr expiry ,secure and http only
  res.cookie('token', token, {
    httpOnly: true,
    // secure: true, // only for https
    maxAge: 3600000,
  });
}
