const router = require('express').Router();
const { createOrder, getUserOrders, getOrder, getAllOrders, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/', auth, createOrder);
router.get('/my-orders', auth, getUserOrders);
router.get('/all', auth, admin, getAllOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, admin, updateOrderStatus);
router.put('/:id/cancel', auth, cancelOrder);

module.exports = router;
