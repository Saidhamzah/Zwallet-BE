const transactionModel = require("../model/Transaction");
const formResponse = require("../helper/formResponse");
const transactionRoutes = require("../routes/Transaction");
const jwt = require("jsonwebtoken");
const { checkToken } = require("../helper/middleware");

module.exports = {
  transactionDetail: async function (req, res) {
    try {
      const token = req.token;
      const [income, outcome, transactionDetail] = await Promise.all([
        transactionModel.income(token),
        transactionModel.outcome(token),
        transactionModel.transactionDetail(token),
      ]);
      const result = {
        income: income,
        outcome: outcome,
        data: transactionDetail,
      };
      if (transactionDetail.length > 0) {
        // console.log(result);
        res.status(200).send({
          success: true,
          message: "success get data",
          data: result,
        });
      } else {
        formResponse([], res, 400, "There is no transaction log");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  transactionHistory: async function (req, res) {
    try {
      const token = req.token;
      const dateStart = req.header("start");
      const until = req.header("until");
      // console.log(dateStart, until);
      const [inWeek, inMonth, outWeek, outMonth, transactionDetail] = await Promise.all([
        transactionModel.transactionHistoryInWeek(token),
        transactionModel.transactionHistoryInMonth(token),
        transactionModel.transactionHistoryOutWeek(token),
        transactionModel.transactionHistoryOutMonth(token),
        transactionModel.transactionDetail(token, dateStart, until),
      ]);
      const result = {
        inWeek: inWeek,
        inMonth: inMonth,
        outWeek: outWeek,
        outMonth: outMonth,
        data: transactionDetail,
      };
      if (transactionDetail.length > 0) {
        // console.log(result);
        res.status(200).send({
          success: true,
          message: "success get data",
          data: result,
        });
      } else {
        formResponse([], res, 400, "There is no transaction log");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  getAll: async function (req, res) {
    try {
      // const token = req.token;

      const result = await transactionModel.transactionAll();
      if (result.length > 0) {
        // console.log(result);
        res.status(200).send({
          success: true,
          message: "success get data",
          data: result,
        });
      } else {
        formResponse([], res, 400, "There is no transaction log");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  createTransfer: async function (req, res) {
    try {
      const token = req.token;
      const id = await transactionModel.getMaxId();
      const data = { ...id[0], sendBy: token.id, ...req.body };
      const pin = parseInt(data.pin);
      const checkPin = await transactionModel.checkPin(token.id, pin);
      if (checkPin.length > 0) {
        delete data.pin;
        await transactionModel.addBalance(data.receiver, data.amountTransfer);
        await transactionModel.updateBalance(token.id, data.balanceLeft);
        delete data.balanceLeft;
        const result = await transactionModel.createTransaction(data);
        if (result.affectedRows > 0) {
          res.status(200).send({
            message: "Success Create Transaction",
            data: data,
          });
        } else {
          formResponse([], res, 400, "Fill with the right type of value");
        }
      } else {
        formResponse([], res, 400, "Wrong Pin");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  editTransfer: async function (req, res) {
    try {
      const { id } = req.query;
      const data = req.body;
      const result = await transactionModel.editTransaction(id, data);
      if (result.affectedRows > 0) {
        res.status(200).send({
          message: "Success Create Transaction",
          data: data,
        });
      } else {
        formResponse([], res, 400, "Failed Edit Transfer Data");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  deleteTransfer: async function (req, res) {
    try {
      const id  = req.query;
      const result=await transactionModel.deleteTransaction(id.id);
      if (result.affectedRows > 0) {
        res.status(200).send({
          message: "Success Delete Transaction"
        });
      } else {
        formResponse([], res, 400, "Failed Delete Transfer Data");
      }
    } catch (error) {
      res.status(500).send({
        message: error.message,
      });
    }
  },
};
