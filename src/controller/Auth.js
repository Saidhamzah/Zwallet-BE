const authModel = require("../model/Auth");
const formResponse = require("../helper/formResponse");

module.exports = {
  register: (req, res) => {
    const { email: email, password: password, fullName: fullName } = req.body;
    console.log(password.length);
    if (password.length > 7) {
      if ((email & password, fullName)) {
        authModel
          .register(email.trim(), password.trim(), fullName.trim())
          .then((data) => formResponse(data, res, 200, "Succes"))
          .catch(() => formResponse([], res, 404, "failed"));
      } else {
        formResponse([], res, 406, "Fill all fields");
      }
    } else {
      formResponse([], res, 406, "Password must be more than 8 character");
    }
  },
  login: async function (req, res) {
    try {
      const { email, password, device_token } = req.body;
    console.log(email, password);
    if (email && password) {
      const login = await authModel.login( email, password)
      console.log(login)
      if(login){
        console.log(email, device_token)
        const device= await authModel.addDeviceToken(email, device_token)
        if(device.affectedRows>0){
          formResponse([], res, 200, "Succes");
          }
          else{
           formResponse([], res, 404, "failed insert device token");
          }
      }else{
        formResponse([], res, 404, "failed");
      }
    } else {
      formResponse([], res, 404, "Fill all fields");
    }} 
    catch (error) {
      formResponse([], res, 500, error.message);
    }
  },
  createPin: (req, res) => {
    const { pin, email } = req.body;
    if (pin.length == 6) {
      if (email) {
        authModel
          .createPin(pin, email)
          .then((data) => formResponse(data, res, 200, "Succes"))
          .catch(() => formResponse([], res, 404, "failed"));
      } else {
        formResponse([], res, 404, "data not found");
      }
    } else {
      formResponse([], res, 406, "pin must be 6 character");
    }
  },
  resetPassword: (req, res) => {
    const { password, email } = req.body;
    // console.log(password, "controller pw");
    if (password.length >= 8) {
      if (email) {
        authModel
          .resetPassword(password, email)
          .then((data) => formResponse(data, res, 200, "Succes"))
          .catch(() => formResponse([], res, 404, "failed"));
      } else {
        formResponse([], res, 404, "data not found");
      }
    } else {
      formResponse([], res, 406, "Password must be more than 8 character");
    }
  },
};
