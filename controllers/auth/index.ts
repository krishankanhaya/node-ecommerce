import { type request, type response, type next } from 'express'
import bcrypt from 'bcryptjs'
import Users from '../../models/Users.ts'
import { redis } from '../../redis/index.ts'
import { StatusCodes } from '../../utils/constants.ts'
import { generateAccessToken, generateRefreshToken } from '../../middlewares/jwt.ts'
import sendMailer from '../../utils/mailer.ts'

type UserInterface = {
  _id: any
  name: string
  email: string
  password: string
  role: string
}

const register = async (req: request, res: response, next: next) => {
  try {
    const { name, email, password } = req.body

    // request params validation
    if (!name || !email || !password) {
      return res.status(StatusCodes.BadRequest).json({ message: 'Invalid request. Request must have name, email and password.' })
    }

    // check existing user with this email
    const existingUser = await Users.findOne({ email })
    if (existingUser) res.status(StatusCodes.BadRequest).json({ message: 'User with this email is already exist. Please try with another email.' })

    const newUser = await Users.create(req.body)
    await newUser.save()
    const regOtp = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
    sendMailer(process.APP_EMAIL, newUser.email, 'Registration OTP', `Your OTP : ${regOtp}.`, `<html><body><h1>Your OTP : ${regOtp}<h1></body></html>`)
    await redis.set(`RegOtp:${newUser._id}`, regOtp, 'EX', 600)
    if (newUser) res.status(StatusCodes.Created).json({ message: 'Registration is successfull.', newUser })

  } catch (error) {
    console.log(`Error during registration.`, error)
    next(new Error("Something went wrong!"))
  }
}

const userActivate = async (req: request, res: response, next: next) => {
  try {
    const { _id, otp } = req.body
    const attempt = await redis.get(`RegActAttempt:${_id}`)
    if (Number(attempt) < 3) {
      const validOtp = await redis.get(`RegOtp:${_id}`)
      if (Number(validOtp) !== otp) {
        await redis.incr(`RegActAttempt:${_id}`)
        res.status(StatusCodes.BadRequest).json({
          message: `Invalid Otp ${3 - Number(attempt)} attemp remaining.`
        })
      } else {
        await Users.updateOne({ _id }, { $set: { status: true } })
        await redis.del(`RegActAttemp:${_id}`, `RegOtp:${_id}`)
        res.status(StatusCodes.Success).json({ message: 'Verified successfully.' })
      }

    } else {
      res.status(StatusCodes.TooManyReqest).json({ messsage: 'OTP Varification attempt many time.' })
    }
  } catch (error) {
    console.log(`Error during activating user.`, error)
    next(new Error("Something went wrong!"))
  }
}

const login = async (req: request, res: response, next: next) => {
  try {
    const { email, password } = req.body

    // request params validation
    if (!email || !password) {
      res.status(StatusCodes.BadRequest).json({ message: 'Invalid request. Request must have email and password.' })
    }

    // check existing user with this email
    const user: UserInterface | any = await Users.findOne({ email })
    if (!user) res.status(StatusCodes.BadRequest).json({ message: 'This email id is not registered. Please try with another email or create new account.' })

    if (!user.status) res.status(StatusCodes.Unauthorized).json({ message: 'User account is not active.' })
    if (!bcrypt.compare(password, user?.password)) res.status(StatusCodes.BadRequest).json({ message: 'Invalid Credential. Either email or passwrod is invalid.' })

    // generate tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // set user cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    res.json({ message: 'User Logged in Successfull.', accessToken })
  } catch (error) {
    console.log(`Error during login.`, error)
    next(new Error("Something went wrong!"))
  }
}
const auth = { register, userActivate, login }

export default auth
