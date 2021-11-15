const router=require("express").Router();
const accountController=require("../../controllers/user/accountController");

router.get("/details/:userId", (req,res)=>{
    accountController.getUserDetails(req.params.userId).then(response=>{
        res.json(response);
    }).catch(err=>{
        res.json(err);
    })
})

module.exports=router;