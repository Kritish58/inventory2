const express = require('express');
const Route = express.Router();

const itemControllers = require('./itemControllers');

Route.get('/fetchAll').get(itemControllers.fetchAll);
Route.get('/fetch-from-category').get(itemControllers.fetchFromCategory);
Route.post('/createOne/:catId').post(itemControllers.createOne);
Route.post('/editName/:itemId').post(itemControllers.editName);
Route.post('/editPrice/:itemId').post(itemControllers.editPrice);
Route.post('/editPcs/:itemId').post(itemControllers.editPcs);
Route.post('/deleteOne/:itemId').post(itemControllers.deleteOne);

module.exports = Route;
