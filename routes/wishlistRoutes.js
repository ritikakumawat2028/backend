const router = require('express').Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

router.get('/', auth, getWishlist);
router.post('/', auth, addToWishlist);
router.delete('/:productId', auth, removeFromWishlist);

module.exports = router;
