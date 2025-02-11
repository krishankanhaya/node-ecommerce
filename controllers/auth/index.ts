import {type request, type response, type next} from 'express'
import bcrypt from 'bcryptjs'
import Users from '../../models/Users.ts'
import { StatusCodes } from '../../utils/constants.ts'
import {generateAccessToken, generateRefreshToken} from '../../middlewares/jwt.ts'

type UserInterface = {
  _id: any
  name: string
  email: string
  password: string
  role: string
}


const register = async(req: request, res: response, next:next) => {
  try{
    const {name, email, password} = req.body

    // request params validation
    if(!name || !email || !password) {
      res.status(StatusCodes.BadRequest).json({message: 'Invalid request. Request must have name, email and password.'})
    }

    // check existing user with this email
    const existingUser = await Users.findOne({email})
    if(existingUser) res.status(StatusCodes.BadRequest).json({message: 'User with this email is already exist. Please try with another email.'})

    const newUser = await Users.create(req.body)
    await newUser.save()

    if(newUser) res.status(StatusCodes.Created).json({message: 'Registration is successfull.', newUser})

  }catch(error) {
    console.log(`Error during registration.`, error)
    next(new Error("Something went wrong!"))
    res.status(StatusCodes.BadRequest).json({message: 'Error during registration.', error})
  }
}

const login = async(req: request, res: response, next: next) => {
try{
    const {email, password} = req.body

    // request params validation
    if(!email || !password) {
      res.status(StatusCodes.BadRequest).json({message: 'Invalid request. Request must have email and password.'})
    }

    // check existing user with this email
    const user: UserInterface | any = await Users.findOne({email})
    if(!user) res.status(StatusCodes.BadRequest).json({message: 'This email id is not registered. Please try with another email or create new account.'})

    if(! bcrypt.compare(password, user?.password)) res.status(StatusCodes.BadRequest).json({message: 'Invalid Credential. Either email or passwrod is invalid.'})

    // generate tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // set user cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    res.json({message: 'User Logged in Successfull.', accessToken })
  }catch(error) {
    console.log(`Error during login.`, error)
    next(new Error("Something went wrong!"))
    res.status(StatusCodes.BadRequest).json({message: 'Error during login.', error})
  }
}
const auth = {register, login}

export default auth
