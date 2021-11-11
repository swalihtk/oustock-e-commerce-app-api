const router=require("express").Router();
const authController=require("../../controllers/user/authController");
const jwt=require("jsonwebtoken");

router.post("/signin", (req, res)=>{
    authController.signin(req.body).then(response=>{
        let token=jwt.sign({_id:response._id}, process.env.JWT_SECRET);
        res.cookie("utoken", token, {
            maxAge:10000000,
            httpOnly:true
        }).send();
    }).catch(err=>{
        if(err.validateFail){
            res.json({
                errorMessage:"validation failed"
            })
        }else if(err.usernotfound){
            res.json({
                errorMessage:"user not found"
            })
        }else{
            res.json({
                errorMessage:"something went wrong"
            })
        }
    })
})

router.post("/signup", (req, res)=>{   
    authController.createUser(req.body).then(response=>{
        res.json({success:"user created"});
    }).catch(err=>{
        res.json({error:"email already registerd"})
    })
})


router.get("/signout", (req,res)=>{
    res.cookie("utoken", "", {
        expires:new Date(0),
        httpOnly:true
    }).send();
})



// user login check
router.get("/check", (req,res)=>{
    let token=req.cookies.utoken;
    if(token){
        let tokenVerify=jwt.verify(token, process.env.JWT_SECRET);
        let userId=tokenVerify._id;

        authController.userFindOne(userId).then(response=>{
            if(response.isActive){
                res.send(true);
            }else{
                res.send(false);
            }
        }).catch(err=>{
            res.send(false);
        })
    }else{
        res.send(false);
    }
})

module.exports=router;