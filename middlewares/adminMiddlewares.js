module.exports={
    adminAuthenticate:(req,res, next)=>{
        let token=req.cookies.atoken;

        if(token){
            next();
        }else{
            res.send("Authentication failed");
        }
    }
}