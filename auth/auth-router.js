const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../users/usersmodel");

router.post("/register", (req, res) => {
  const credentials = req.body;

  if (isValid(credentials)) {
    const hash = bcryptjs.hashSync(credentials.password, 8);
    credentials.password = hash;

    Users.add(credentials)
      .then((user) => {
        res.status(201).json({ data: user });
      })
      .catch((err) => {
        res.status(500).json({ err: err.message });
      });
  } else {
    res.status(400).json({
      message: "Please provide username and password",
    });
  }
});
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = generateToken(user);
          

          res.status(200).json({ message: "Welcome to our API", token });
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      });
  } else {
    res.status(400).json({
      message: "Please provide username and password that is a string",
    });
  }
});



function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };
  const secret = process.env.JWT_secret || "supersecret";
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, secret, options);
}

function isValid(user) {
  return Boolean(user.username && user.password);
}
module.exports = router;
