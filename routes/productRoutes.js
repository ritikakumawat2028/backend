const router = require('express').Router();
const { getProducts, getProduct, getProductBySlug, createProduct, updateProduct, deleteProduct, getRelatedProducts } = require('../controllers/productController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);
router.post('/', auth, admin, upload.array('images', 10), createProduct);
router.put('/:id', auth, admin, upload.array('images', 10), updateProduct);
router.delete('/:id', auth, admin, deleteProduct);

module.exports = router;
