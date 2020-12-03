const db = require("../helper/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const formResponse = require("../helper/formResponse");

module.exports = {
  register: (email, password, fullName) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, newPassword) => {
        db.query(
          `INSERT INTO user (email, password, fullName, roleId, isActive) VALUES ('${email}', '${newPassword}', '${fullName}', 100, 1)`,
          (err, res) => {
            console.log(res, "ini adalah ress");
            console.log(err, "ini adalah err");
            if (!err) {
              resolve(res);
            } else {
              reject(err);
            }
          }
        );
      });
    });
  },

  login: (email, password) => {
    // console.log(email, password, "model");
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT isActive FROM user WHERE email= ?",
        email,
        (err, res) => {
          // console.log(res[0].isActive);
          if (res[0].isActive == "1") {
            db.query("SELECT * FROM user WHERE email= ?", email, (err, res) => {
              if (!err) {
                let data = [];
                if (res.length > 0) {
                  data = res;
                } else {
                  data = [
                    {
                      id: 0,
                      name: "kosong",
                      email: "kosong",
                      roles: "kosong",
                      password:
                        "$2y$10$4W/5o6dcvCIjm9ym/dkXQ.l6C/p8rCh0swxh8NlvwvAWfYG0gLSUO ",
                    },
                  ];
                }

                const {
                  password: hashedPassword,
                  roleId,
                  email,
                  id,
                  name,
                } = data[0];
                console.log(hashedPassword);
                bcrypt.compare(password, hashedPassword, (error, result) => {
                  console.log(result);
                  if (result) {
                    const tokenJWT = jwt.sign(
                      { email, id, name, roleId },
                      process.env.SECRET_KEY
                    );
                    const token = `Bearer ${tokenJWT}`;
                    const data = {
                      token: token,
                      role: roleId,
                    };
                    resolve(data);
                  } else {
                    return reject(error);
                  }
                });
              }
            });
          } else {
            reject(err);
          }
        }
      );
    });
  },

  createPin: (pin, email) => {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE user SET pin='${pin}' WHERE email=?`,
        email,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            return reject(err);
          }
        }
      );
    });
  },
  resetPassword: (password, email) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          const errMessage = "password failed";
          return reject(errMessage);
        }
        console.log(hashedPassword, "hash pw model");

        db.query(
          `UPDATE user SET password='${hashedPassword}' WHERE email=?`,
          email,
          (err, result) => {
            if (!err) {
              resolve(result);
            } else {
              return reject(err);
            }
          }
        );
      });
    });
  },
};
