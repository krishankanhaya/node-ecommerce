import express from 'express'
import admin from '../../controllers/admin/index.ts'
import {verifyAccessToken} from '../../middlewares/auth.ts'

const adminRoutes = express.Router()

adminRoutes.get('/getAllUser', verifyAccessToken, admin.getAllUsers)

export default adminRoutes
