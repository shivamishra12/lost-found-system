const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Please provide an item name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  type: {
    type: String,
    enum: ['Lost', 'Found'],
    required: [true, 'Please specify if the item is Lost or Found'],
  },
  location: {
    type: String,
    required: [true, 'Please provide the location'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide the date'],
    default: Date.now,
  },
  contactInfo: {
    type: String,
    required: [true, 'Please provide contact information'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

// Text index for search functionality
itemSchema.index({ itemName: 'text', description: 'text', location: 'text' });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
