const router = require("express").Router();
const categoryController = require("../../controllers/home/categoryController");

router.get("/list", (req, res) => {
  categoryController
    .listAllCategory()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

module.exports = router;
