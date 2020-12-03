const formResponse = require("../helper/formResponse");
const modelTopup = require("../../src/model/Topup");
const midtransClient = require("midtrans-client");

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: "SB-Mid-server-ZvK1XrFozq8bFIUHYH5grfSk",
  clientKey: "SB-Mid-client-i_EGfhfpfwFtL_Er",
});

module.exports = {
  getAllTopup: async function (req, res) {
    try {
      const result = await modelTopup.getAllTopup();
      const newData = result;
      if (result.length > 0) {
        res.status(200).send({
          message: `Success get all of Topup`,
          data: newData,
        });
      } else {
        formResponse([], res, 400, "Topup data is empty");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  getAllTopupByStep: async function (req, res) {
    try {
      const { limit } = req.query;
      const result = await modelTopup.getAllTopupByStep(limit);
      const newData = result;
      if (result.length > 0) {
        res.status(200).send({
          message: `Success get Topup`,
          data: newData,
        });
      } else {
        formResponse([], res, 400, "Topup data is empty");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  editTopup: async function (req, res) {
    try {
      const { id } = req.query;
      let newData = req.body;
      const result = await modelTopup.editTopup(id, newData);
      if (result.affectedRows > 0) {
        res.status(201).send({
          message: "Success edit topup",
          rowsAffected: result.affectedRows,
        });
      } else {
        formResponse([], res, 400, "Failed Edit Topup Data");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  createTopup: async function (req, res) {
    try {
      let newData = req.body;
      const id = await modelTopup.maxTopup();
      data = { id: id[0].max, ...newData };
      const result = await modelTopup.createTopup(data);
      if (result.affectedRows > 0) {
        res.status(201).send({
          message: "Success Create Topup Data",
          data: result,
        });
      } else {
        formResponse([], res, 400, "Failed Create Topup Data");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  deleteTopup: async function (req, res) {
    try {
      const { id } = req.query;
      const result = await modelTopup.deleteTopup(id);
      if (!result.affectedRows > 0) {
        res.status(200).send({
          message: `Success delete a topup`,
        });
      } else {
        formResponse([], res, 400, "Failed Delete Topup Data");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },

  getMidtrans: (req, res) => {
    const { email } = req.token;
    const { amount } = req.body;
    let parameter = {
      transaction_details: {
        order_id: "order-id-node-" + Math.round(new Date().getTime() / 1000),
        gross_amount: parseInt(amount),
      },
      credit_card: {
        secure: true,
      },
    };
    snap.createTransaction(parameter).then((transaction) => {
      // transaction token
      // console.log(transaction);
      let token = transaction.token;
      // console.log("transactionToken:", transactionToken);
      // console.log(email, amount, token, " from model");
      modelTopup
        .midTrans(email, amount, token)
        .then((data) => formResponse(data.token, res, 200, "success changed"))
        .catch((err) => formResponse(err, res, 404, "failed changed"));
      // formResponse(transactionToken, res, 200, "success get token");
    });
  },
};
