const mongoose = require('mongoose');

const User = new mongoose.Schema({
  email: {
    type: String,
    minlength: [5, 'email must be at least 5 characters long'],
    maxLength: [30, 'email can be no longer than 30 characters'],
  },
  password: {
    type: String,
    minlength: [5, 'password must be at least 5 characters long'],
    maxLength: [30, 'password can be no longer than 30 characters'],
  },
});

module.exports = mongoose.model('User', User);
