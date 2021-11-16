const router=require("express").Router();
const { response } = require("express");
const categoryManager=require("../../controllers/admin/categoryManager");
const {adminAuthenticate} =require("../../middlewares/adminMiddlewares");

// add to category
router.post("/add",adminAuthenticate, (req,res)=>{   
    categoryManager.addCategory(req.body).then(response=>{  
        res.json({categoryAdded:true});
    }).catch(err=>{
        res.json(err);
    })
})

// get from categry
router.get("/get",adminAuthenticate, (req, res)=>{
    categoryManager.listCategory().then(response=>{
        res.json(response);
    }).catch(err=>{
        res.json(err);
    })
})

// get sub category
router.get("/getSub/:categoryName",adminAuthenticate, (req,res)=>{
    categoryManager.listSubCategory(req.params.categoryName).then(response=>{
        res.json(response.subCategery);
    }).catch(err=>{
        res.json(err);
    })
})

// delete main from category
router.delete("/deleteMain/:categoryName",adminAuthenticate, (req, res)=>{
    categoryManager.deleteMainCategory(req.params.categoryName).then(response=>{
        res.json(response);
    }).catch(err=>{
        res.json(err);
    })
})

// delete sub from category
router.delete("/deleteSub",adminAuthenticate, (req, res)=>{
    
    categoryManager.deleteSubCategory(req.query).then(response=>{
        res.json(response);
    }).catch(err=>{
        res.json(err);
    })
})


// update main category name
router.put("/updateMain",adminAuthenticate, (req, res)=>{
    // newName, mainCatName

    categoryManager.updateMainCat(req.body.newName, req.body.mainCatName).then(response=>{
        res.json(response);
    }).catch(e=>{
        res.status(401).send(e);
    })
})

// update sub category name
router.put("/updateSub",adminAuthenticate, (req, res)=>{
    // mainCatName, subCatName, subCatNewName

    categoryManager.updateSubCat(req.body).then(response=>{
        res.json(response);
    }).catch(e=>{
        res.status(401).send(e);
    })
})

module.exports=router;