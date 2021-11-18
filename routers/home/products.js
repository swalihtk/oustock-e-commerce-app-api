const router = require("express").Router();
const productController = require("../../controllers/home/productController");

router.get("/listLatest", (req, res) => {
  productController
    .listLatestProduct()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// product details
router.get("/details/:prodId", (req, res) => {
  productController
    .productDetails(req.params.prodId)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// list product in main category
router.get("/listMain/:productName", (req, res) => {
  productController
    .productListMain(req.params.productName)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// list product in sub category
router.get("/listSub", (req, res) => {
  let { categoryName, subCatName } = req.query;

  productController
    .productListSub(categoryName, subCatName)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
