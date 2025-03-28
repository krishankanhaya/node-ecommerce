import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  parant: {
    type: String,
    default: null
  }
}, { timestamps: true })

const Category = mongoose.model('Category', categorySchema)

export default Category
