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

// search products
router.get("/search", (req, res) => {
  /*** Product Req Query ***/
  let { productName } = req.query;

  productController
    .searchProducts(productName)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// get offerd products
router.get("/getOfferd", (req,res)=>{
  let {page, forBanner}=req.query;
  if(!page) page=1;
  if(!forBanner) forBanner=false;

  productController.getOfferProducts(forBanner, page).then(response=>{
    res.status(200).json(response);
  }).catch(err=>{
    res.json(err);
  })
})

module.exports = router;
