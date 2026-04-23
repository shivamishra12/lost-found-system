const express = require('express');
const router = express.Router();
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Note: /search needs to come before /:id, otherwise 'search' is treated as an id.
// We handled search inside getItems via query params: GET /api/items?name=xyz or GET /api/items/search?name=xyz
// To match exact requirement "GET /api/items/search?name=xyz":
router.get('/search', getItems);

router.route('/')
  .get(getItems)
  .post(protect, createItem);

router.route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
