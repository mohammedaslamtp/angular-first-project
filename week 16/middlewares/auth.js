const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  let response = {};
  const authHeader = req.headers["Autherization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    response.tokenValid = false;
    return res.json(response);
  }

  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, data) => {
    if (err) {
      console.log(err);
      response.error = err.message;
      if (err.expiredAt) {
        response.expiredAt = err.expiredAt;
      }
      return res.json(response);
    }
    req.data = data;
    next();
  });
}

module.exports = { authToken: authenticateToken };
