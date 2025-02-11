import {type request, type resposne} from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/Users.ts'

type UserInterface = {
  _id: any;
  name: string;
  email: string;
  password: string;
  role: string;
}

export const generateAccessToken = (user: UserInterface) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

export const generateRefreshToken = (user: UserInterface) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

export const getNewAccessToken = (req: request, res: resposne) => {
  const refreshToken = req.cookies.refreshToken // Get refresh token from HTTP-only cookie

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token not provided' })
  }

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err: unknown, decoded: UserInterface) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token' })
    }

    // Find the user by the decoded userId
    const user: UserInterface | any = await User.findOne({_id: decoded._id}, {v:0})

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Generate a new access token
    const newAccessToken = generateAccessToken(user)

    res.status(200).json({ accessToken: newAccessToken })
  })
}
