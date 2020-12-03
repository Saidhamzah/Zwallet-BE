const authRoutes = require("express").Router();

const { checkToken } = require("../helper/middleware");

const authController = require("../controller/Auth");

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.patch("/create_pin", authController.createPin);
authRoutes.patch("/reset_password", authController.resetPassword);

module.exports = authRoutes;
