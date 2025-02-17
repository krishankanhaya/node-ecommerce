import express, { type Request, type Response, type Router } from 'express'
import razorPay from '../../controllers/razorPay/index.ts'

const rezorPayRoutes: Router = express.Router()

rezorPayRoutes.post('/createOrder', razorPay.createOrder)
rezorPayRoutes.post('/verifyPayment', razorPay.verifyPayment)

export default rezorPayRoutes


