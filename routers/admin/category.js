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
router.delete("/deleteMain",adminAuthenticate, (req, res)=>{
    categoryManager.deleteMainCategory(req.body.categoryName).then(response=>{
        res.json(response);
    }).catch(err=>{
        res.json(err);
    })
})

// delete sub from category
router.delete("/deleteSub",adminAuthenticate, (req, res)=>{
    categoryManager.deleteSubCategory(req.body).then(response=>{
        res.json(response);
    }).catch(err=>{
        res.json(err);
    })
})

module.exports=router;