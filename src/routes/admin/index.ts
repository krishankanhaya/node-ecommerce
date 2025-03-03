import express from 'express'
import admin from '../../controllers/admin/index.js'
import { verifyAccessToken } from '../../middlewares/auth.js'

const adminRoutes = express.Router()

adminRoutes.get('/getAllUser', verifyAccessToken, admin.getAllUsers)

export default adminRoutes
