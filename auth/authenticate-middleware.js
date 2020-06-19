const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const secret = process.env.JWT_SECRET || "supersecret";

    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) {
        // the token is invalid
        res.status(401).json({ message: "invalid credentials" });
      } else {
        // the token is good
        req.jwt = decodedToken;
        next();
      }
    });
  } else {
    res
      .status(400)
      .json({ message: "please provide the authentication information" });
  }
};