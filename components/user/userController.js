const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');

const User = require('./User');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.sendStatus(400);
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ success: false, emailDoesNotExist: true });
  }
  const match = bcrypt.compareSync(password, user.password);
  if (!match) {
    return res.status(200).json({ success: false, passwordIncorrect: true });
  }
  jwt.sign({ _id: user._id, email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '1d' }, (err, token) => {
    if (token) {
      return res.status(200).json({ success: true, token: 'Bearer ' + token });
    }
  });
};

const signup = async (req, res) => {
  const { email, password, key } = req.body;
  if (!email || !password || !key) {
    return res.sendStatus(400);
  }
  if (password.length < 5 || password.length >= 30) {
    return res.sendStatus(400);
  }
  if (key !== process.env.SECRET_SIGNUP_KEY) {
    return res.status(200).json({ success: false, invalidKey: true });
  }
  const emailIsValid = emailValidator.validate(email);
  if (!emailIsValid) {
    return res.sendStatus(400);
  }
  const user = await User.findOne({ email });
  if (user) {
    return res.status(200).json({ success: false, emailAlreadyExists: true });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
  jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.TOKEN_SECRET, { expiresIn: '1d' }, (err, token) => {
    if (token) {
      return res.status(200).json({ success: true, token: 'Bearer ' + token });
    }
  });
};

module.exports = {
  login,
  signup,
};
