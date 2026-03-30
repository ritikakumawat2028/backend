const router = require('express').Router();
const { getBrands, getBrand, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/', getBrands);
router.get('/:id', getBrand);
router.post('/', auth, admin, upload.single('logo'), createBrand);
router.put('/:id', auth, admin, upload.single('logo'), updateBrand);
router.delete('/:id', auth, admin, deleteBrand);

module.exports = router;
