const express = require('express');
const Route = express.Router();

const authenticateToken = require('../../config/authenticate');

const itemControllers = require('./itemControllers');

Route.route('/fetchAll').get(authenticateToken, itemControllers.fetchAll);
Route.route('/fetch-from-category').get(authenticateToken, itemControllers.fetchFromCategory);
Route.route('/createOne/:catId').post(authenticateToken, itemControllers.createOne);
Route.route('/editOne/:itemId').post(authenticateToken, itemControllers.editOne);
Route.route('/deleteOne/:itemId').post(authenticateToken, itemControllers.deleteOne);
Route.route('/changeCategory/:catId').post(authenticateToken, itemControllers.changeCategory);

module.exports = Route;

// Route.route('/editName/:itemId').post(itemControllers.editName);
// Route.route('/editPrice/:itemId').post(itemControllers.editPrice);
// Route.route('/editPcs/:itemId').post(itemControllers.editPcs);
