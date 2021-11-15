const router=require("express").Router();
const userManager=require("../../controllers/admin/userManager");
const {adminAuthenticate}=require("../../middlewares/adminMiddlewares");

router.get("/active",adminAuthenticate, (req,res)=>{
    userManager.listActiveUser().then(response=>{
        res.json(response);
    }).catch(err=>{
        res.json("Something went wrong");
    })
})


router.get("/blocked",adminAuthenticate, (req,res)=>{
    userManager.listBlockedUsers().then(response=>{
        res.json(response);
    }).catch(err=>{
        res.json("Something went wrong");
    })
})


router.put("/manage/:userId",adminAuthenticate,(req,res)=>{
    userManager.manageUserAccess(req.params.userId).then(response=>{
        if(response.blocked){
            res.json({blocked:true})
        }else{
            res.json({blocked:false});
        }
    }).catch(err=>{
        res.json({errorMessage:"Something went wrong on blocking"});
    })
})


module.exports=router;