const Item = require('../models/Item');

// @desc    Get all items or search items
// @route   GET /api/items
// @route   GET /api/items/search?name=xyz
// @access  Public
const getItems = async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};

    if (name) {
      // Using regex for partial matching
      query = {
        $or: [
          { itemName: { $regex: name, $options: 'i' } },
          { description: { $regex: name, $options: 'i' } },
          { location: { $regex: name, $options: 'i' } }
        ]
      };
    }

    const items = await Item.find(query).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('userId', 'name email');

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add an item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;

    if (!itemName || !description || !type || !location || !contactInfo) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const item = new Item({
      itemName,
      description,
      type,
      location,
      date: date || Date.now(),
      contactInfo,
      userId: req.user._id,
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check for user ownership
    if (item.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to update this item' });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check for user ownership
    if (item.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
