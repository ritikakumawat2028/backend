const router = require('express').Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/', getSettings);
router.put('/', auth, admin, upload.single('logo'), updateSettings);

module.exports = router;
