import { type Request, type Response } from 'express'
import Users from '../../models/Users.js'
import { StatusCodes } from '../../utils/constants.js'
import { redis } from '../../redis/index.js'

const getAllUsers = async (_: Request, res: Response) => {
  try {
    let allUsers: any = await redis.get('allUsers')
    if (allUsers) res.status(StatusCodes.OK).json({ message: 'Get Cached All Users Success.', Users: JSON.parse(allUsers) })
    allUsers = await Users.find()
    redis.set('allUsers', JSON.stringify(allUsers), 'EX', 60)
    res.status(StatusCodes.OK).json({ message: 'Get All Users Success.', allUsers })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: 'Error during getting users.', error })
  }
}

const admin = { getAllUsers }

export default admin
