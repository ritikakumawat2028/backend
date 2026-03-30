const router = require('express').Router();
const { getBanners, getAllBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/', getBanners);
router.get('/all', auth, admin, getAllBanners);
router.post('/', auth, admin, upload.single('image'), createBanner);
router.put('/:id', auth, admin, upload.single('image'), updateBanner);
router.delete('/:id', auth, admin, deleteBanner);

module.exports = router;
