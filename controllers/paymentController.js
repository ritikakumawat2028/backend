const Razorpay = require('razorpay');
const stripe = require('stripe');
const crypto = require('crypto');

// Create Razorpay order
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ success: false, message: 'Razorpay credentials not configured' });
    }
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), currency: 'INR',
      receipt: 'KF_' + Date.now(),
    });
    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) { next(error); }
};

// Verify Razorpay payment
exports.verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: 'Payment verified', paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) { next(error); }
};

// Create Stripe payment intent
exports.createStripePaymentIntent = async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ success: false, message: 'Stripe credentials not configured' });
    }
    const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(amount * 100), currency: 'inr',
      metadata: { userId: req.user._id.toString() },
    });
    res.json({ success: true, clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (error) { next(error); }
};

// Verify Stripe payment
exports.verifyStripePayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.body;
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ success: false, message: 'Stripe credentials not configured' });
    }
    const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status === 'succeeded') {
      res.json({ success: true, message: 'Payment verified', paymentId: paymentIntentId });
    } else {
      res.status(400).json({ success: false, message: 'Payment not completed', status: paymentIntent.status });
    }
  } catch (error) { next(error); }
};
