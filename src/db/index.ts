import mongoose from 'mongoose'

const URI: string = process.env.MONGO_URI as string

const connection = mongoose.connect(URI)

export default connection
