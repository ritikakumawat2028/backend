const router = require('express').Router();
const { getCategories, getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', auth, admin, upload.single('image'), createCategory);
router.put('/:id', auth, admin, upload.single('image'), updateCategory);
router.delete('/:id', auth, admin, deleteCategory);

module.exports = router;
