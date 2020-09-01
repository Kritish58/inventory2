const Route = require('express').Router();

const userController = require('./userController');

Route.route('/login').post(userController.login);
Route.route('/signup').post(userController.signup);

module.exports = Route;
