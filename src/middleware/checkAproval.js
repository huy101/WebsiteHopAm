// middleware/checkApproval.js
const { Song } = require('../models/song');

// Middleware to check if the song is approved
const checkApproval = async (req, res, next) => {
  try {
    // Apply approval filter to the query
    req.approvalFilter = { status: true }; // Default to approved songs only

    // If a user is querying for pending songs, change the filter
    if (req.query.pending === 'true') {
      req.approvalFilter = { status: false }; // Only fetch pending songs
    }

    // If the request requires approved songs, ensure we set the filter to true
    if (req.query.approved === 'false') {
      req.approvalFilter = { status: true }; // Only approved songs
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error in checkApproval middleware:', error);
    res.status(500).json({ message: 'Error in approval check' });
  }
};

module.exports = checkApproval;
