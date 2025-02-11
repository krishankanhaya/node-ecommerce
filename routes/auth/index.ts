import express, {type Request, type Response, type Router} from 'express'
import auth from '../../controllers/auth/index.ts'

const authRoutes : Router = express.Router()

authRoutes.get('/test', (req: Request, res: Response) => {
  res.status(200).json({message: 'From Auth get.'})
})

authRoutes.post('/register', auth.register)
authRoutes.post('/login', auth.login)

export default authRoutes


