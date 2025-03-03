import { type Request, type Response, type NextFunction } from 'express'
import Store from '../../models/Store.ts'
import Users from '../../models/Users.ts'
import Category from '../../models/Category.ts'
import { StatusCodes } from '../../utils/constants.ts'

const createStore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { vendorId, storeName, businessStage, industry, businessMode, paymentMode, country, firstName, lastName, address, state, city, pincode, isRegistered } = req.body;

    // Check for missing required fields
    if (
      !vendorId || !storeName || !businessStage || !industry || !businessMode ||
      !paymentMode || !country || !firstName || !lastName || !address ||
      !state || !city || !pincode || isRegistered === undefined
    ) {
      res.status(400).json({ message: "All required fields must be provided" });
    }

    let vendor = await Users.findOne({ _id: vendorId })
    if (!vendor) res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: `Vendor doesn't exist with this vendorId.` })

    // Check if shop already exists
    const existingStore = await Store.findOne({ storeName });
    if (existingStore) {
      res.status(400).json({ message: "Store with this name already exists" });
    }

    const newStore = await Store.create(req.body)
    await newStore.save()

    vendor.store.push(newStore._id)
    await vendor.save()

    res.status(StatusCodes.OK).json({ message: `Store is created successfully.`, newStore })
  } catch (error) {
    console.error(`Error during creating store : ${error}`)
    next(new Error("Something went wrong!"))
  }
}

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id, name, parant } = req.body
    if (!name || !_id) res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ messaeg: 'Category name and storeId(_id) is requird.' })

    let store = await Store.findOne({ _id })
    if (!store) res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ message: 'There is no shop exist with this storeId(_id).' })

    let existCategory = await Category.findOne({ name })
    if (existCategory) res.status(StatusCodes.CONFLICT).json({ message: 'Category already exist with this name.' })

    let newCategory = await Category.create({ name, parant })
    await newCategory.save()

    store.categories.push(newCategory._id)
    await store.save()

    res.status(StatusCodes.OK).json({ message: 'New category is created.', newCategory })
  } catch (error) {
    console.log(`Error during creating category : ${error}`)
    next(new Error("Something went wrong!"))
  }
}

const vendor = { createStore, createCategory }

export default vendor
