const express = require('express');
const { getDashboard, getEarnings } = require('../controllers/ownerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('owner'));
router.get('/dashboard', getDashboard);
router.get('/earnings', getEarnings);

module.exports = router;
