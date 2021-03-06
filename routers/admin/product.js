const router = require("express").Router();
// const upload=require("../../components/mutler");
const productController = require("../../controllers/admin/productController");
const { adminAuthenticate } = require("../../middlewares/adminMiddlewares");

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
      res.status(201).json(response);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

// list all products
router.get("/listAll", adminAuthenticate, (req, res) => {
  let { page, mainCategory, sort, name } = req.query;

  if (!page) {
    page = 1;
  }
  if(!mainCategory){
    mainCategory="";
  }
  if(!sort){
    sort=-1;
  }
  if(!name) name="";
  

  productController
    .listAllProducts(page,mainCategory,name, sort)
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
router.put("/update/:productId", adminAuthenticate, async(req, res) => {
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



module.exports = router;
