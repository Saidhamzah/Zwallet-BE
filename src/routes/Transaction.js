const transactionRoutes = require("express").Router();

const transactionController = require("../controller/Transaction");
const { checkToken } = require("../helper/middleware");

transactionRoutes.get(
  "/detail",
  checkToken,
  transactionController.transactionDetail
);
transactionRoutes.get(
  "/history",
  checkToken,
  transactionController.transactionHistory
);
transactionRoutes.get("/all", transactionController.getAll);
transactionRoutes.patch("", transactionController.editTransfer);
transactionRoutes.post("/", checkToken, transactionController.createTransfer);

transactionRoutes.delete("", transactionController.deleteTransfer);
module.exports = transactionRoutes;
