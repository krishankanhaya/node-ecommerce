import express, { type application, type request, type response, type next, type err } from 'express'
import connection from './db/index.ts'
import routes from './routes/index.ts'
import Log from './models/Log.ts'

const app: application = express()

// middlewares
app.use(express.json())
const PORT: number = Number(process.env.PORT) as number || 5000

// Serve static files
app.use('/payment', express.static('./public'));

// route
app.use('/auth', routes.authRoutes)
app.use('/admin', routes.adminRoutes)
app.use('/razorpay', routes.razorPay)

// TODO : later use for load balancing
app.get('/test', (req: request, res: response) => {
  console.log('req', req)
  res.status(200).json({ message: 'test is success.' })
})

app.use(async (err: err, req: request, res: request, next: next) => {
  if (err) {
    try {
      await Log.create({
        method: req.method,
        ip: req.ip,
        reqBody: JSON.stringify(req.body),
        url: req.originalUrl,
        status: res.statusCode || 500,
        message: err.message,
      })
    } catch (dbError) {
      console.error("Error saving log to database:", dbError)
    }
  }
  next(err)
})

app.use((err: err, res: request) => {
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
