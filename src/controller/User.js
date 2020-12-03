const userModel = require("../model/User");
const formResponse = require("../helper/formResponse");
const MIMEType = require("../helper/MIME-type");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

module.exports = {
  search: (req, res) => {
    const { q } = req.query;
    const { id } = req.token;
    userModel
      .search(q, id)
      .then((data) => formResponse(data, res, 200, "success"))
      .catch((err) => formResponse([], res, 404, "failed"));
  },
  changePassword: (req, res) => {
    const { id } = req.token;
    const { password, newPassword } = req.body;
    console.log(newPassword);
    if (newPassword.length > 7) {
      userModel
        .changePassword(id, password, newPassword)
        .then((data) => formResponse(data, res, 200, "success"))
        .catch((err) => formResponse([], res, 404, "not found"));
    } else {
      formResponse([], res, 406, "newPassword must be 8 character or more.");
    }
  },
  changePin: (req, res) => {
    const { id } = req.token;
    const { pin, newPin } = req.body;
    if (pin) {
      userModel
        .changePin(id, pin, newPin)
        .then((data) => formResponse(data, res, 200, "Success Update"))
        .catch((err) => formResponse([], res, 404, "not found"));
    } else {
      formResponse([], res, 400, "Pin not same");
    }
  },
  patchUser: (req, res) => {
    // console.log(req.token);
    const { id } = req.token;
    const uploadImage = multer({ storage: storage }).single("images");
    uploadImage(req, res, (err) => {
      console.log(req.file, "controller");
      console.log(req.body, "controller");
      if (!req.file) {
        userModel
          .patchUser(id, req.body)
          .then((data) => formResponse(data, res, 200, "Name has been change."))
          .catch((err) => formResponse([], res, 404, "data not found."));
      } else {
        const type = req.file.originalname.split(".")[1];
        const mime = MIMEType(type);
        if (mime == false) {
          formResponse([], res, 400, "File is not Image");
        } else {
          if (!err) {
            const imageName = `${process.env.BASE_URI}/images/${req.file.filename}`;
            userModel
              .patchUser(id, req.body, imageName)
              .then((data) => {
                formResponse(data, res, 201, "Success change Photo");
              })
              .catch((err) => {
                formResponse(err, res, 400, "Failed change Photo");
              });
          } else {
            formResponse(err, res, 400, err.message);
          }
        }
      }
    });
  },
  patchAllUser: (req, res) => {
    const { id } = req.params;
    userModel
      .patchAllUser(id, req.body)
      .then((data) => formResponse(data, res, 200, "success patch data"))
      .catch((err) => formResponse(err, res, 400, "failed"));
  },

  //hamzah
  home: async function (req, res) {
    try {
      const search = req.query.search || "";
      const sortBy = req.query.sortBy || "dateTransfer";
      const sortType = req.query.sortType || "desc";
      const limit = req.query.limit || 50;
      const page = req.query.page || 0;
      const token = req.token;
      // console.log(token);
      const [result, history] = await Promise.all([
        userModel.home(token),
        userModel.homehistory(token, search, sortBy, sortType, limit, page),
      ]);
      // console.log(result, "result");
      // console.log(history, "result");
      // console.log(history.length,"result")
      if (result.length > 0) {
        // formResponse(token, res, 200, "success get data");
        if (history.length > 0) {
          res.status(200).send({
            success: true,
            message: "success get data",
            data: { result, data: history },
          });
        } else {
          res.status(200).send({
            success: true,
            message: "success get data",
            data: result,
          });
        }
      } else {
        formResponse([], res, 400, " Data Not Found");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  getAllUser: async function (req, res) {
    try {
      const search = req.query.search || "";
      const sortBy = req.query.sortBy || "createdDate";
      const sortType = req.query.sortType || "asc";
      const limit = req.query.limit || 10;
      const page = req.query.page || 0;
      const result = await userModel.getAllUser(
        search,
        sortBy,
        sortType,
        limit,
        page
      );
      if (result.length > 0) {
        res.status(200).send({
          message: `Success get all user data`,
          data: result,
        });
      } else {
        formResponse([], res, 400, "The data is empty");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  getById: async function (req, res) {
    try {
      const token = req.token;
      const result = await userModel.getById(token);
      if (result.length > 0) {
        res.status(200).send({
          message: `Success get all user data`,
          data: result,
        });
      } else {
        formResponse([], res, 400, "The data is empty");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  getUserById: async function (req, res) {
    try {
      const { id } = req.query;
      const result = await userModel.getUserById(id);
      if (result.length > 0) {
        res.status(200).send({
          message: `Success get all user data`,
          data: result,
        });
      } else {
        formResponse([], res, 400, "The data is empty");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  deletePhone: async function (req, res) {
    try {
      const id = req.token;
      const result = await userModel.deletePhone(id.id);
      if (result.affectedRows > 0) {
        res.status(200).send({
          message: `Success delete phone`,
          data: result,
        });
      } else {
        formResponse([], res, 400, "The data is empty");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  updatePhone: async function (req, res) {
    try {
      const id = req.token;
      const phoneNumber = req.body.phoneNumber;
      const result = await userModel.updatePhone(id.id, phoneNumber);
      if (result.affectedRows > 0) {
        res.status(200).send({
          message: `Success update phone`,
          data: result,
        });
      } else {
        formResponse([], res, 400, "The data is empty");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  deactiveUser: async function (req, res) {
    try {
      const { id } = req.query;
      const active = req.body.isActive;
      const result = await userModel.deactivateUser(id, active);
      if (result.affectedRows > 0) {
        res.status(200).send({
          message: `Success get all user data`,
          data: result,
        });
      } else {
        formResponse([], res, 400, "Failed Deactive User");
      }
    } catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
};
