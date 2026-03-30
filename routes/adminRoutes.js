const router = require('express').Router();
const { getDashboardStats, getUsers, toggleBlockUser, deleteUser } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');

router.get('/dashboard', auth, admin, getDashboardStats);
router.get('/users', auth, admin, getUsers);
router.put('/users/:id/block', auth, admin, toggleBlockUser);
router.delete('/users/:id', auth, admin, deleteUser);

module.exports = router;
