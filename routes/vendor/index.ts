import express from 'express'
import vendor from '../../controllers/vendor/index.ts'
import { verifyVendorRole } from '../../middlewares/vendor.ts'

const vendorRoutes = express.Router()

vendorRoutes.post('/createStore', verifyVendorRole, vendor.createStore)
vendorRoutes.post('/createCategory', verifyVendorRole, vendor.createCategory)

export default vendorRoutes
