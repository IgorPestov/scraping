const express = require("express");
const routes = express.Router();
const controller = require('../controllers/controller')


routes.post('/send',controller.send)

module.exports = routes