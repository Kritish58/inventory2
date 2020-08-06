const express = require('express');
const Route = express.Router();

const itemControllers = require('./itemControllers');

Route.route('/fetchAll').get(itemControllers.fetchAll);
Route.route('/fetch-from-category').get(itemControllers.fetchFromCategory);
Route.route('/createOne/:catId').post(itemControllers.createOne);
Route.route('/editOne/:itemId').post(itemControllers.editOne);
Route.route('/deleteOne/:itemId').post(itemControllers.deleteOne);
Route.route('/changeCategory/:catId').post(itemControllers.changeCategory);

module.exports = Route;

// Route.route('/editName/:itemId').post(itemControllers.editName);
// Route.route('/editPrice/:itemId').post(itemControllers.editPrice);
// Route.route('/editPcs/:itemId').post(itemControllers.editPcs);
