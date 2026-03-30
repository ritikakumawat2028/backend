const router = require('express').Router();
const { createRazorpayOrder, verifyRazorpayPayment, createStripePaymentIntent, verifyStripePayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.post('/razorpay/create', auth, createRazorpayOrder);
router.post('/razorpay/verify', auth, verifyRazorpayPayment);
router.post('/stripe/create', auth, createStripePaymentIntent);
router.post('/stripe/verify', auth, verifyStripePayment);

module.exports = router;
