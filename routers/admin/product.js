const router=require("express").Router();
// const upload=require("../../components/mutler");
const productController=require("../../controllers/admin/productController");
const {adminAuthenticate} =require("../../middlewares/adminMiddlewares");
const upload=require("../../components/mutler");


router.post("/getImageLink",upload.array("image"), (req,res)=>{
    productController.prouctImageUploadLink(req.files).then(response=>{
        res.json(response);
    }).catch(err=>{
        res.json(err);
    })
})


router.post("/add", async(req, res)=>{
    
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
      
    productController.addNewProduct(req.body).then(response=>{
        res.json({productAdded:true});
    }).catch(err=>{
        res.status(400).send(err);
    })

})



// list all products
router.get("/listAll", (req, res)=>{
    productController.listAllProducts().then(response=>{
        res.json(response);
    }).catch(err=>{
        res.status(401).send(err);
    })
})


// get one product details
router.get("/listOne/:prodId", (req,res)=>{
    productController.getOneProductDetails(req.params.prodId).then(response=>{
        res.json(response);
    }).catch(e=>{
        res.json(e);
    })
})

// update product
router.put("/update/:productId", (req,res)=>{

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

    productController.updateAProduct(req.params.productId, req.body).then(response=>{
        console.log(response);
        res.json(response);
    }).catch(err=>{
        res.json(err);
    })
})

// delete product
router.delete("/delete/:productId", (req, res)=>{
    
    /****PARAMS******
     * productId
     ****************/
    productController.deleteProduct(req.params.productId).then(response=>{
        res.json(response);
    }).catch(e=>{
        res.json({error:true});
    })
})


module.exports=router;