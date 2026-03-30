const router = require('express').Router();
const { getCart, addToCart, updateCartItem, removeCartItem, clearCart, saveForLater } = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.get('/', auth, getCart);
router.post('/', auth, addToCart);
router.put('/:itemId', auth, updateCartItem);
router.delete('/:itemId', auth, removeCartItem);
router.delete('/', auth, clearCart);
router.put('/:itemId/save-for-later', auth, saveForLater);

module.exports = router;
