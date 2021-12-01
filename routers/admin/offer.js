const router=require("express").Router();
const offerController=require("../../controllers/admin/offerControll");

// create offer
router.post("/create", (req, res)=>{
    let {offerName, expireDate, percentage}=req.body;
    offerController.addOffer(offerName, expireDate, percentage).then(response=>{
        res.status(201).json(response);
    }).catch(e=>{
        res.json(e);
    });
})

// delete offer
router.delete("/delete/:offerId",(req,res)=>{
    offerController.deleteOffer(req.params.offerId).then(response=>{
        res.status(200).json(response);
    }).catch(e=>{
        res.json(e);
    })
})

// edit offer 
router.put("/edit/:offerId",(req,res)=>{
    let {offerName, expireDate, percentage}=req.body;
    offerController.editOffer(req.params.offerId, offerName, expireDate, percentage).then(response=>{
        res.status(200).json(response);
    }).catch(e=>{
        res.json(e);
    });
})

// list all offers
router.get("/listAll", (req,res)=>{
    let {page}=req.query;
    
    if(!page) page=1;
    offerController.listAllOffers(page).then(response=>{
        res.status(200).json(response);
    }).catch(e=>{
        res.json(e);
    })
})

// list one
router.get("/getOne/:id",(req,res)=>{
    offerController.getOneOfferDetails(req.params.id).then(response=>{
        res.status(200).json(response);
    }).catch(err=>{
        res.json(err);
    })
})

// apply offer
router.post("/applyOffer", (req,res)=>{
    let {productId, offerId, offerName, expires, percentage}=req.body;
    offerController.setOfferForProduct(productId, offerName, percentage, offerId, expires).then(response=>{
        res.status(201).json(response);
    }).catch(e=>{
        res.json(e);
    })
})

// check offer expres
router.get("/checkOfferExpires", (req,res)=>{
    offerController.checkOfferExpires(new Date()).then(response=>{
        res.json(response);
    }).catch(e=>{
        res.json(e);
    })
})

module.exports=router;