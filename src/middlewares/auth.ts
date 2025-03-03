import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { StatusCodes } from '../utils/constants.js'

// Middleware to validate access token
export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token: any = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'No token provided' })

  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '', (err: unknown, user: any) => {
    if (err) res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired token' })
    req.body.user = user
    next()
  })
}
