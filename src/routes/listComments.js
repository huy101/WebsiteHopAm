// Import necessary modules
const express = require('express');
const router = express.Router();
const  Comment  = require('../models/comments'); // Assuming you have a Comment model

// GET endpoint to fetch all comments
router.get('/comments', async (req, res) => {
  try {
    const comments = await Comment.find().populate('userId', 'username');
    res.status(200).send(comments); // Send all comments as JSON
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send({ message: 'Failed to fetch comments' });
  }
});

// POST endpoint to add a new comment


module.exports = router;
