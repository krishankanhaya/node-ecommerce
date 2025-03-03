import express, { type Router } from 'express'
import vendor from '../../controllers/vendor/index.js'
import { verifyVendorRole } from '../../middlewares/vendor.js'

const vendorRoutes: Router = express.Router()

vendorRoutes.post('/createStore', verifyVendorRole, vendor.createStore)
vendorRoutes.post('/createCategory', verifyVendorRole, vendor.createCategory)

export default vendorRoutes
