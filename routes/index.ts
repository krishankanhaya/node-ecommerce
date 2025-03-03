import authRoutes from './auth/index.ts'
import adminRoutes from './admin/index.ts'
import vendorRoutes from './vendor/index.ts'
import razorPay from './razorPay/index.ts'

const routes = { authRoutes, adminRoutes, vendorRoutes, razorPay }

export default routes
