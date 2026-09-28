const express = require('express');
const { body } = require('express-validator');
const { createComplaint, getMyComplaints } = require('../controllers/complaintController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);
router.post(
  '/',
  [
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  createComplaint
);
router.get('/mine', getMyComplaints);

module.exports = router;
