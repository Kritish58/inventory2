const express = require('express');
const Route = express.Router();

const categoriesControllers = require('./categoryControllers');

Route.route('/fetch/all').get(categoriesControllers.fetchAll);
Route.route('/createOne').post(categoriesControllers.createOne);
Route.route('/editOne/:catId').post(categoriesControllers.editOne);
Route.route('/deleteOne/:catId').post(categoriesControllers.deleteOne);

module.exports = Route;
