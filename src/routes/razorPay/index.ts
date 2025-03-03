import express, { type Router } from 'express'
import razorPay from '../../controllers/razorPay/index.js'

const rezorPayRoutes: Router = express.Router()

rezorPayRoutes.post('/createOrder', razorPay.createOrder)
rezorPayRoutes.post('/verifyPayment', razorPay.verifyPayment)

export default rezorPayRoutes
