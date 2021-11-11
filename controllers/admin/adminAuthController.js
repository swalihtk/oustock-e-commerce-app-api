const User=require("../../models/user/users");
const crypto=require("crypto");

module.exports={
    signin:function (body){
        return new Promise(async(resolve,reject)=>{
            try{
                let existingUser=await User.findOne({email:body.email});
                if(existingUser && existingUser.role==="admin"){
                    let password=crypto.createHmac("sha256", body.password).update("secret").digest("hex");

                    if(password===existingUser.password){
                        resolve(existingUser);
                    }else{
                        reject({validateFail:true})
                    }
                }else{
                    reject({adminNotfound:true})
                }
            }catch(e){
                
                reject("error");
            }
        })
    },
    adminFindOne:function(adminId){
        return new Promise(async(resolve, reject)=>{
            let admin=await User.findOne({_id:adminId});
            if(admin && admin.role==="admin"){
                resolve(admin);
            }else{
                reject("admin not found")
            }
        })
    }
}