const Users=require("../../models/user/users");


module.exports={
    getUserDetails:(userId)=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let userDetails=await Users.findOne({_id:userId});
                resolve(userDetails);
            }catch(e){
                reject(e.message);
            }
        })
    }
}