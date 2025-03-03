import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import { roles } from '../utils/constants.ts'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: roles[2],
    enum: roles,
  },
  stores: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
    required: function() { return this.role === 'VENDOR' }
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  }
}, { timestamps: true })

userSchema.pre("save", async function(next) {
  if (!this.isModified('password')) return next()

  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)

  next()
})

const User = mongoose.model('User', userSchema)

export default User


