const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();

const categoreiesAPI = require('./components/category/categoryAPI');
const itemsAPI = require('./components/item/itemAPI');
const userAPI = require('./components/user/userAPI');

app.use(cors());
app.use(fileUpload());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/categories', categoreiesAPI);
app.use('/api/items', itemsAPI);
app.use('/api/users', userAPI);

if (process.env.NODE_ENV === 'PRODUCTION') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => res.sendFile(path.resolve('client', 'build', 'index.html')));
}

module.exports = app;
