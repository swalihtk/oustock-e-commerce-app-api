const router=require("express").Router();
const multer=require("../../components/mutler");
const bannerController=require("../../controllers/admin/bannerController");

router.post("/create", (req,res)=>{
    let {title, url, image}=req.body;

    bannerController.createBanner(title, url, image).then(response=>{
        res.status(201).json(response);
    }).catch(err=>{
        res.status(400).json(err);
    })
})

router.get("/listAll", (req,res)=>{
    let {page, sortValue}=req.query;
    
    if(!page) page=1;
    if(!sortValue) sortValue=-1

    bannerController.listAllBanners(page, sortValue).then(response=>{
        res.status(200).json(response);
    }).catch(e=>{
        res.status(400).send(e);
    })
})

router.delete("/delete/:id", (req,res)=>{
    bannerController.deleteBanner(req.params.id).then(response=>{
        res.status(201).json(response);
    }).catch(err=>{
        res.status(403).send(err);
    })
})

module.exports=router;