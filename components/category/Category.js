const mongoose = require('mongoose');
const { Schema } = mongoose;

const Category = new Schema({
  name: {
    type: String,
    minlength: [3, 'category name cannot be samller than 3 characters'],
    maxlength: [30, 'category name cannot be longer than 30 characters'],
    required: true,
  },
});

module.exports = mongoose.model('Category', Category);
