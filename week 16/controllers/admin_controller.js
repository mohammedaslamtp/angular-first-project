const Users = require("../models/users");
const bcrypt = require("bcrypt");

module.exports = {
  ad_home: (req, res) => {
    res.send("ad home");
  },

  userDetails: (req, res) => {
    let response={}
    console.log(req.query.id)
    Users.findById(req.query.id, (err, doc) => {
      if (err) {
        console.log(err);
        res.json({ error: "data not found!" });
      } else {
        console.log(doc);
        response.user = doc;
        res.json(response);
      }
    });
  },

  // costumers
  costumers: async (req, res) => {
    let users = await Users.find();
    res.json(users);
  },

  // admin login submition
  login: (req, res) => {
    try {
      let response = {};
      console.log(req.body);
      if (req.body.email === process.env.ADMIN_EMAIL) {
        console.log("amdin email valid");
        response.email = true;
        if (req.body.password === process.env.ADMIN_PASSWORD) {
          response.password = true;
          console.log("admin confirmed");
          res.json(response);
        } else {
          response.password = false;
          console.log("admin password is not valid");
          res.json(response);
        }
      } else {
        response.email = false;
        console.log("email not valid!");
        res.json(response);
      }
    } catch (e) {
      console.log("ERROR!! ", e);
    }
  },

  //  to create user
  createUser: async (req, res) => {
    try {
      console.log("create user working..");
      console.log(req.body);
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(req.body.password, salt);
      console.log(password);
      Users.create(
        {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          password: password
        },
        (err, data) => {
          if (err) {
            //  database error | err : 500
            if (err.code == 11000) {
              exist = Object.keys(err.keyValue)[0];
              console.log(err);
              console.log("dupe", err.code);
              res.json({
                duplicate: true,
                code: err.code,
                keyValue: err.keyValue,
                reason: `${exist} already exist!`
              });
            } else {
              console.log(err);
              res.json({ error: err });
            }
          } else {
            console.log("user added succussfully");
            console.log(data);
            res.json({ success: true });
          }
        }
      );
    } catch (error) {
      console.log("create user error!! ", error);
    }
  },

  // to update a user data
  updateUser: (req, res) => {
    try {
      console.log(req.body);
      console.log('id: ',req.query.id)
      Users.find;
      Users.findOneAndUpdate(
        { _id: req.query.id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
          }
        },
        { new: true },
        (err, doc) => {
          if (err) {
            // database error | err:500
            console.log("user data updation error!");
            console.log(err);
            if (err.code === 11000) {
              exist = Object.keys(err.keyValue)[0];
              console.log("dupe", err.code);
              res.json({
                duplicate: true,
                code: err.code,
                keyValue: err.keyValue,
                reason: `${exist} already exist!`
              });
            }
          } else {
            console.log(doc);
            res.json(doc);
          }
        }
      );
    } catch (e) {
      console.log("user data edition error!!");
      console.log(e);
    }
  },

  // to delete user
  deleteUser: (req, res) => {
    try {
      console.log("delete user");
      console.log(req.body);
      Users.findOneAndUpdate(
        { _id: req.body.id },
        {
          $set: { isDeleted: true }
        },
        { new: true },
        (err, doc) => {
          if (err) {
            // database error | err:500
            console.log("delete user databse error");
            console.log(err);
          } else {
            console.log("user deletion successful");
            console.log(doc);
            res.json({ deleted: true });
          }
        }
      );
    } catch (e) {
      console.log("user deletion error!!");
      console.log(e);
    }
  }
};
