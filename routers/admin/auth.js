const router = require("express").Router();
const adminAuthController = require("../../controllers/admin/adminAuthController");
const jwt = require("jsonwebtoken");

router.use("/signin", (req, res) => {
  adminAuthController
    .signin(req.body)
    .then((response) => {
      let token = jwt.sign({ _id: response._id }, process.env.JWT_SECRET);
      res
        .cookie("atoken", token, {
          maxAge: 10000000000,
          httpOnly: true,
        })
        .send();
    })
    .catch((err) => {
      if (err.validateFail) {
        res.json({
          errorMessage: "validation failed",
        });
      } else if (err.adminNotfound) {
        res.json({
          errorMessage: "admin not found",
        });
      } else {
        res.json({
          errorMessage: "something went wrong",
        });
      }
    });
});

router.get("/signout", (req, res) => {
  res
    .cookie("atoken", "", {
      expires: new Date(0),
      httpOnly: true,
    })
    .send();
});

// admin login check
router.get("/check", (req, res) => {
  let token = req.cookies.atoken;
  if (token) {
    let tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
    let userId = tokenVerify._id;

    adminAuthController
      .adminFindOne(userId)
      .then((response) => {
        res.json({ login: true, userId });
      })
      .catch((err) => {
        res.json({ login: false });
      });
  } else {
    res.json({ login: false });
  }
});

module.exports = router;
