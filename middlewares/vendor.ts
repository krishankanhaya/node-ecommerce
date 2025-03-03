import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { StatusCodes } from '../utils/constants.ts'

// Middleware to validate vendor role
export const verifyVendorRole = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'No token provided' })
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: Error, user: any) => {
    if (err) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired token' })
    if (user.role === 'VENDOR') {
      req.body.user = user
      next()
    } else return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired token' })
  })
}
