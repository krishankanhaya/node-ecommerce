import {type request, type response, type next} from 'express'
import jwt from 'jsonwebtoken'
import { StatusCodes } from '../utils/constants.ts'

// Middleware to validate access token
export const verifyAccessToken = (req: request, res: response, next: next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token){
    // throw new Error('No token provided')
    return res.status(StatusCodes.BadRequest).json({ message: 'No token provided' })

  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: unknown, user: any) => {
    if (err) return res.status(StatusCodes.BadRequest).json({ message: 'Invalid or expired token' })
    req.user = user
    next()
  })
}
