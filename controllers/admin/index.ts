import {type request, type response} from 'express'
import Users from '../../models/Users.ts'
import { StatusCodes } from '../../utils/constants.ts'
import { redis } from '../../redis/index.ts'

const getAllUsers = async(req: request, res: response) =>{
  try {
    let allUsers: any = await redis.get('allUsers')
    if(allUsers) return res.status(StatusCodes.Success).json({message: 'Get Cached All Users Success.', Users: JSON.parse(allUsers)})
    allUsers = await Users.find()
    redis.set('allUsers', JSON.stringify(allUsers), 'EX', 60)
    res.status(StatusCodes.Success).json({message: 'Get All Users Success.', allUsers})
  } catch (error) {
    console.log(`Errro during get all users : ${error}`)
    res.status(StatusCodes.BadRequest).json({message: 'Error during getting users.', error})
  }
}

const admin =  {getAllUsers}

export default admin
