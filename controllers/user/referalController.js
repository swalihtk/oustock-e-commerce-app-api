const User =require("../../models/user/users");

module.exports={
    applyReferal:async function(req,res){
        try{
            let {referal}=req.body;
            let existingUser=await User.findOne({"wallet.referal":referal});

            if(!existingUser){
                res.json({error:"Referal Code not found!!"});
            }else{
                let response=await User.updateOne({_id:existingUser._id}, {
                    $set:{
                        "wallet.amount":existingUser.wallet.amount+100
                    }
                })
                res.json(response);
            }
        }catch(e){
            console.log(e);
            res.json({"error":"something went wrong"});
        }
    }
}