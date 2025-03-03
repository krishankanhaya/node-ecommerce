import mongoose from 'mongoose'

const storeSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  storeName: {
    type: String,
    required: true,
    unique: true
  },
  categories: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
  },
  businessStage: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  businessMode: {
    type: String,
    required: true
  },
  paymentMode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  locality: {
    type: String,
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  pincode: {
    type: Number,
    length: 6,
    required: true
  },
  website: {
    type: String,
  },
  isRegistered: {
    type: Boolean,
    required: true
  },
}, { timestamps: true })

const Store = mongoose.model('Store', storeSchema)

export default Store
