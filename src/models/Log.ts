import mongoose from "mongoose"

const logSchema = new mongoose.Schema({
    method: String,
    ip: String,
    reqBody: String,
    url: String,
    status: Number,
    message: String,
    timestamp: { type: Date, default: Date.now }
})

const Log = mongoose.model('Log',logSchema);

export default Log
