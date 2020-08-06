const mongoose = require('mongoose');
const { Schema } = mongoose;

const Category = new Schema({
  name: {
    type: String,
    minlength: [2, 'category name cannot be samller than 3 characters'],
    maxlength: [30, 'category name cannot be longer than 30 characters'],
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Item',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Category', Category);
