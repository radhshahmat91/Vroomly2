const asyncHandler = require('../middleware/asyncHandler');
const Complaint = require('../models/Complaint');

// POST /api/complaints
const createComplaint = asyncHandler(async (req, res) => {
  const { subject, message, bookingId } = req.body;
  const complaint = await Complaint.create({
    raisedBy: req.user._id,
    booking: bookingId || undefined,
    subject,
    message,
  });
  res.status(201).json({ success: true, complaint });
});

// GET /api/complaints/mine
const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ raisedBy: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, complaints });
});

module.exports = { createComplaint, getMyComplaints };
