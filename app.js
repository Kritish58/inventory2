const cors = require('cors');
const fileUpload = require('express-fileupload');
const express = require('express');
const app = express();

const categoreiesAPI = require('./components/category/categoryAPI');
const itemsAPI = require('./components/item/itemAPI');

app.use(cors());
app.use(fileUpload());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/categories', categoreiesAPI);
app.use('/api/items', itemsAPI);

module.exports = app;
