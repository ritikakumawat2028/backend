const router = require('express').Router();
const { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/couponController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.post('/validate', auth, validateCoupon);
router.get('/', auth, admin, getCoupons);
router.post('/', auth, admin, createCoupon);
router.put('/:id', auth, admin, updateCoupon);
router.delete('/:id', auth, admin, deleteCoupon);

module.exports = router;
