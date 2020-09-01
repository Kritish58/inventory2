const express = require('express');
const Route = express.Router();

const authenticateToken = require('../../config/authenticate');

const categoriesControllers = require('./categoryControllers');

Route.route('/fetchAll').get(authenticateToken, categoriesControllers.fetchAll);
Route.route('/createOne').post(authenticateToken, categoriesControllers.createOne);
Route.route('/editOne/:catId').post(authenticateToken, categoriesControllers.editOne);
Route.route('/deleteOne/:catId').post(authenticateToken, categoriesControllers.deleteOne);

Route.route('/generate/structure').get(authenticateToken, categoriesControllers.genStruct);

module.exports = Route;
