const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
const dotenv = require('dotenv');
const path = require('path');

const app = require('./app');

dotenv.config({ path: path.join(__dirname, 'config/.env') });

mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => {
    console.log(chalk.bold.blue('mongodb connected'));
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(chalk.bold.yellow(`server is up and runnig on port ${PORT}`));
});
