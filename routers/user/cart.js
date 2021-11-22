const router = require("express").Router();
const cartController = require("../../controllers/user/cartController");

router.post("/add", (req, res) => {
  let { userId, productId } = req.body;

  cartController
    .addToCart(userId, productId)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

router.post("/countManage", (req, res) => {
  /**** Body ***
   * userId
   * productId
   * action -> 1 for increment 0 for decrement
   * */

  let { userId, productId, action } = req.body;

  cartController
    .quantityManager(userId, productId, action)
    .then((response) => {
      res.status(201).json(response);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/delete", (req, res) => {
  let { userId, productId } = req.body;

  cartController
    .delteProductFromCart(userId, productId)
    .then((response) => {
      res.status(202).json(response);
    })
    .catch((err) => {
      res.status(204).json(err);
    });
});

module.exports = router;
