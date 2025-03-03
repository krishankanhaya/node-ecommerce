import express, { type Application, type Request, type Response, type NextFunction, } from 'express'
import connection from './db/index.js'
import routes from './routes/index.js'
import Log from './models/Log.js'

const app: Application = express()

// middlewares
app.use(express.json())
const PORT: number = Number(process.env.PORT) as number || 5000

// Serve static files for razorpay
app.use('/payment', express.static('./public'));

// route
app.use('/auth', routes.authRoutes)
app.use('/admin', routes.adminRoutes)
app.use('/vendor', routes.vendorRoutes)
app.use('/razorpay', routes.razorPay)

// TODO : later use for load balancing
app.get('/test', (_: Request, res: Response) => {
  res.status(200).json({ message: 'test is success.' })
})

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    try {
      const newLog = await Log.create({
        method: req.method,
        ip: req.ip,
        reqBody: JSON.stringify(req.body),
        url: req.originalUrl,
        status: res.status || 500,
        message: err.message,
      })
      await newLog.save()
    } catch (dbError) {
      console.error("Error saving log to database:", dbError)
    }
  }
  next(err)
})

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error",
  })
})

app.listen(PORT, () => {
  // db connection
  connection
    .then(() => {
      console.log(`Successfully connected to database. Server is running on port : ${PORT}.`)
    })
    .catch((error: string) => console.log(`Error during connecting to database : ${error}`))
})
