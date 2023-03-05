const Users = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

module.exports = {
  // to home page
  home: (req, res, next) => {
    res.send("home page");
    next();
  },

  // signup submition
  register: async (req, res) => {
    try {
      console.log("signup submition");
      console.log(req.body);
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(req.body.password, salt);
      console.log(password);
      let user = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: password
      };
      let response = {};
      Users.create(
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
          password: password
        },
        (err, doc) => {
          if (err) {
            if (err.code === 11000) {
              exist = Object.keys(err.keyValue)[0];
              console.log(err);
              res.json({
                duplicate: true,
                code: err.code,
                keyValue: err.keyValue,
                reason: `${exist} already exist!`
              });
              console.log("dupe", err.code);
            } else {
              res.json({ error: err });
            }
          } else {
            console.log("Registered successfully.");
            console.log("data: ", doc);
            response.user = user;
            let accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {
              expiresIn: "1h"
            });
            response.accessToken = accessToken;
            res.json(response);
          }
        }
      );
    } catch (e) {
      console.log("ERROR!!! ", e);
    }
  },

  //   login submition
  login: (req, res) => {
    try {
      console.log("login");
      console.log(req.body);
      let email = req.body.email;
      let response = {};
      Users.findOne({ email: email }, (err, doc) => {
        if (err) {
          // if server down | database error | err:500
          console.log(err);
        } else {
          if (doc !== null) {
            response.email = true;
            console.log(doc);
            bcrypt.compare(req.body.password, doc.password, (err, result) => {
              if (err) {
                // bcryption went somthing wrong
                console.log("bcryption went somthing wrong!! ");
                console.log(err);
              } else {
                if (result) {
                  response.password = true;
                  let user = {
                    name: doc.name,
                    email: doc.email,
                    phone: doc.phone,
                    password: doc.password
                  };
                  let accessToken = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, {
                    expiresIn: "1h"
                  });
                  response.accessToken = accessToken;
                  response.user = user;
                  res.json(response);
                } else {
                  console.log("password invalid!");
                  response.password = false;
                  res.json(response);
                }
              }
            });
          } else {
            console.log("email invalid!");
            response.email = false;
            res.json(response);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
};
