const jwt = require("jsonwebtoken");
const formResponse = require("./formResponse");

module.exports = {
  checkToken: (req, res, next) => {
    const bearerToken = req.header("authorization");
    const token = bearerToken.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.SECRET_KEY, (err, token) => {
        if (err) {
          return res.status(404).json({
            success: false,
            message: "Token is not invalid",
          });
        } else {
          req.token = token;
          next();
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Auth Token is not supplied",
      });
    }
  },
  checkRole: (req, res, next) => {
    const role = req.token.roles;
    if (role === "admin") {
      next();
    } else {
      formResponse([], res, 404, "Page not found");
    }
  },
};
