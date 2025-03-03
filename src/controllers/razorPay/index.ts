import { type Request, type Response } from 'express'
import Razorpay from "razorpay"
import { validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils.js'
import fs from 'fs'

const razorpay: any = new Razorpay({
  key_id: process.env.RP_KEY_ID as string,
  key_secret: process.env.RP_SECRET_KEY as string,
})

// Function to read data from JSON file
const readData = async () => {
  if (fs.existsSync('orders.json')) {
    const data: string = fs.readFileSync('orders.json', 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

// Function to write data to JSON file
const writeData = (data: any) => {
  fs.writeFileSync('orders.json', JSON.stringify(data, null, 2));
};

// Initialize orders.json if it doesn't exist
if (!fs.existsSync('orders.json')) {
  writeData([]);
}
const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency, receipt, notes } = req.body;

    const options = {
      amount: amount * 100, // Convert amount to paise
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);

    // Read current orders, add new order, and write back to the file
    const orders = await readData();
    orders.push({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: 'created',
    });
    writeData(orders);

    res.json(order); // Send order details to frontend, including order ID
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating order');
  }
}

// Route to handle payment verification
const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret: string = razorpay?.key_secret;
  const body = razorpay_order_id + '|' + razorpay_payment_id;

  try {
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
    if (isValidSignature) {
      // Update the order with payment details
      const orders = await readData();
      const order = orders.find((o: any) => o.order_id === razorpay_order_id);
      if (order) {
        order.status = 'paid';
        order.payment_id = razorpay_payment_id;
        writeData(orders);
      }
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).json({ status: 'verification_failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error verifying payment' });
  }
};
const razorPay = { createOrder, verifyPayment }

export default razorPay
