const router = require("express").Router();
// const upload=require("../../components/mutler");
const productController = require("../../controllers/admin/productController");
const { adminAuthenticate } = require("../../middlewares/adminMiddlewares");
const upload = require("../../components/mutler");

router.post(
  "/getImageLink",
  upload.array("image"),
  adminAuthenticate,
  (req, res) => {
    productController
      .prouctImageUploadLink(req.files)
      .then((response) => {
        res.json(response);
      })
      .catch((err) => {
        res.json(err);
      });
  }
);

router.post("/add", adminAuthenticate, async (req, res) => {
  /*****PARAMS********
    name,
    price,
    images,
    details,
    shortDescription,
    color,
    brand,
    category,
    subCategory,
    quantity
    *********************/

  productController
    .addNewProduct(req.body)
    .then((response) => {
      res.json({ productAdded: true });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// list all products
router.get("/listAll", adminAuthenticate, (req, res) => {
  let { page } = req.query;

  if (!page) {
    page = 1;
  }

  productController
    .listAllProducts(page)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(401).send(err);
    });
});

// get one product details
router.get("/listOne/:prodId", adminAuthenticate, (req, res) => {
  productController
    .getOneProductDetails(req.params.prodId)
    .then((response) => {
      res.json(response);
    })
    .catch((e) => {
      res.json(e);
    });
});

// update product
router.put("/update/:productId", adminAuthenticate, (req, res) => {
  /******PARAMS******
    name,
    price,
    image,
    details,
    shortDescription,
    color,
    brand,
    category,
    subCategory,
    imageIds
    *******************/

  productController
    .updateAProduct(req.params.productId, req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

// delete product
router.delete("/delete/:productId", adminAuthenticate, (req, res) => {
  /****PARAMS******
   * productId
   ****************/
  productController
    .deleteProduct(req.params.productId)
    .then((response) => {
      res.json(response);
    })
    .catch((e) => {
      res.json({ error: true });
    });
});

// filter products
router.get("/filter", (req, res) => {
  // mainCat,subCat
  let { mainCat, subCat } = req.query;
  productController
    .filterProducts(mainCat, subCat)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
