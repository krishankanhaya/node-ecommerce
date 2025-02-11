import {type request, type response} from 'express'
import Users from '../../models/Users.ts'
import { StatusCodes } from '../../utils/constants.ts'

const getAllUsers = async(req: request, res: response) =>{
  try {
    const users = await Users.find()
    res.status(StatusCodes.Success).json({message: 'Get All Users Success.', users})
  } catch (error) {
    console.log(`Errro during get all users : ${error}`)
    res.status(StatusCodes.BadRequest).json({message: 'Error during getting users.', error})
  }
}

const admin =  {getAllUsers}

export default admin
