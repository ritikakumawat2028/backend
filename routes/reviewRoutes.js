const router = require('express').Router();
const { getProductReviews, addReview, getAllReviews, moderateReview, deleteReview } = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', auth, addReview);
router.get('/all', auth, admin, getAllReviews);
router.put('/:id/moderate', auth, admin, moderateReview);
router.delete('/:id', auth, admin, deleteReview);

module.exports = router;
