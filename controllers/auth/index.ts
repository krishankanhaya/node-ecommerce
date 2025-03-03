import { type Request, type Response, type NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import Users from '../../models/Users.ts'
import Store from '../../models/Store.ts'
import { redis } from '../../redis/index.ts'
import { roles, StatusCodes } from '../../utils/constants.ts'
import { generateAccessToken, generateRefreshToken } from '../../middlewares/jwt.ts'
import sendMailer from '../../utils/mailer.ts'

type UserInterface = {
  _id: any
  name: string
  email: string
  password: string
  role: string
}


const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, stores } = req.body

    if (!name || !email || !password || !role || !roles.includes(role)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid request. Request must have name, email, role, and password.' });
    }

    const existingUser = await Users.findOne({ email })
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User with this email already exists. Please try another email.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({ name, email, password: hashedPassword, role });

    if (role === 'VENDOR' && (!stores || stores.length === 0)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide at least one store detail for vendor registration.' });
    }

    if (role === 'VENDOR') {
      const newStores = await Store.insertMany(stores.map((store: any) => ({ ...store, vendorId: newUser._id })));
      newUser.stores = newStores.map(store => store._id);
      await newUser.save();
    }

    const regOtp = Math.floor(Math.random() * 900000) + 100000;
    sendMailer(process.env.APP_EMAIL as string, newUser.email, 'Registration OTP', `Your OTP: ${regOtp}.`, `<html><body><h1>Your OTP: ${regOtp}</h1></body></html>`);
    await redis.set(`RegOtp:${newUser._id}`, regOtp, 'EX', 600);

    return res.status(StatusCodes.CREATED).json({ message: 'Registration successful.', newUser });
  } catch (error) {
    console.error(`Error during registration.`, error);
    return next(new Error(error.message || "Something went wrong!"));
  }
};


const userActivate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id, otp } = req.body
    const userStatus = await Users.findOne({ _id }, { status: 1, _id: 0 })
    if (userStatus && userStatus.status) res.status(StatusCodes.CONFLICT).json({ message: 'User is already verified.' })
    if (userStatus === null) res.status(StatusCodes.BAD_REQUEST).json({ message: 'User is not registerd.' })
    const attempt = await redis.get(`RegActAttempt:${_id}`)
    if (attempt === 'nil') res.status(StatusCodes.BAD_REQUEST).json({ message: 'OTP is expired.' })
    if (Number(attempt) < 3) {
      const validOtp = await redis.get(`RegOtp:${_id}`)
      if (Number(validOtp) !== otp) {
        await redis.incr(`RegActAttempt:${_id}`)
        res.status(StatusCodes.BAD_REQUEST).json({
          message: `Invalid Otp ${3 - Number(attempt) - 1} attemps remaining.`
        })
      } else {
        await Users.updateOne({ _id }, { $set: { status: true } })
        await redis.del(`RegActAttemp:${_id}`, `RegOtp:${_id}`)
        res.status(StatusCodes.OK).json({ message: 'Verified successfully.' })
      }

    } else {
      res.status(StatusCodes.TOO_MANY_REQUESTS).json({ messsage: 'OTP Varification attempt many time.' })
    }
  } catch (error) {
    console.log(`Error during activating user.`, error)
    next(new Error("Something went wrong!"))
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid request. Request must have email and password.' })
    }

    // check existing user with this email
    const user: UserInterface | any = await Users.findOne({ email })
    if (!user) res.status(StatusCodes.BAD_REQUEST).json({ message: 'This email id is not registered. Please try with another email or create new account.' })

    if (!user.status) res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User account is not active.' })
    if (!bcrypt.compare(password, user?.password)) res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid Credential. Either email or passwrod is invalid.' })

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
