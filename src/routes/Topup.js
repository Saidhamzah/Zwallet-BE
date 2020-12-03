const topupRoute = require("express").Router();
const { checkToken } = require("../helper/middleware");

const topupController = require("../controller/Topup");

topupRoute.get("/", topupController.getAllTopupByStep);
topupRoute.get("/all", topupController.getAllTopup);
topupRoute.patch("", topupController.editTopup);
topupRoute.post("/", topupController.createTopup);
topupRoute.delete("", topupController.deleteTopup);
topupRoute.patch("/midtrans", checkToken, topupController.getMidtrans);

module.exports = topupRoute;
