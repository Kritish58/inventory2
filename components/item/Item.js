const mongoose = require('mongoose');
const { Schema } = mongoose;

const Item = new Schema({
  name: {
    type: String,
    minlength: [2, 'name should be at least 3 characters long'],
    maxlength: [30, 'name should not be longer than 30 characters'],
    required: true,
  },
  catId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    requried: true,
  },
  price: {
    type: Number,
    requried: true,
    min: [10, 'the price cannot be smaller than 10'],
    max: [500000, 'the price cannot be larger than 5 lakhs'],
  },
  pcs: {
    type: Number,
    required: true,
    min: [0, 'the pcs cannot be smaller than 0'],
    max: [10000, 'the pcs cannot be larger than 10000'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Item', Item);
