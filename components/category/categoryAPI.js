const express = require('express');
const Route = express.Router();

const categoriesControllers = require('./categoryControllers');

Route.route('/fetchAll').get(categoriesControllers.fetchAll);
Route.route('/createOne').post(categoriesControllers.createOne);
Route.route('/editOne/:catId').post(categoriesControllers.editOne);
Route.route('/deleteOne/:catId').post(categoriesControllers.deleteOne);

Route.route('/generate/structure').get(categoriesControllers.genStruct);

module.exports = Route;
