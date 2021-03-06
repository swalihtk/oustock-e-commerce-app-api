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
   * quantity
   * */

  let { userId, productId, quantity } = req.body;

  cartController
    .quantityManager(userId, productId, quantity)
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

// get all products
router.get("/all/:userId", async (req, res) => {
  try {
    let response = await cartController.getAllItemsInCart(req.params.userId);
    res.json(response);
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
