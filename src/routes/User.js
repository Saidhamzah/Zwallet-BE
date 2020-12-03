const userRoutes = require("express").Router();
const { checkToken } = require("../helper/middleware");

const userController = require("../controller/User");

userRoutes.get("/search", checkToken, userController.search);
userRoutes.patch("/change_password", checkToken, userController.changePassword);
userRoutes.patch("/change_pin", checkToken, userController.changePin);
userRoutes.patch("/patch_user", checkToken, userController.patchUser);
userRoutes.patch("/deletePhone", checkToken, userController.deletePhone);
userRoutes.patch("/updatePhone", checkToken, userController.updatePhone);
userRoutes.get("/home", checkToken, userController.home);
userRoutes.get("/all", checkToken, userController.getAllUser);
userRoutes.get("/", checkToken, userController.getById);
userRoutes.get("/getuser", checkToken, userController.getUserById);
userRoutes.patch("/patchAllUser", checkToken, userController.patchAllUser);
userRoutes.patch("/delete", userController.deactiveUser);
module.exports = userRoutes;
