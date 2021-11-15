const Users=require("../../models/user/users");

module.exports={
    listActiveUser:()=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let users=await Users.find({isActive:true});
                resolve(users);
            }catch(e){
                reject(e.message);
            }
        })
    },


    listBlockedUsers:()=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let users=await Users.find({isActive:false});
                resolve(users);
            }catch(e){
                reject(e.message);
            }
        })
    },


    manageUserAccess:(userId)=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let findUser=await Users.findOne({_id:userId});

                if(findUser){
                    if(findUser.isActive){
                        Users.updateOne({_id:userId}, {$set:{isActive:false}}).then(response=>{
                            resolve({blocked:true})
                        }).catch(err=>{
                            resolve(err.message);
                        })
                    }else{
                        Users.updateOne({_id:userId}, {$set:{isActive:true}}).then(response=>{
                            resolve({blocked:false})
                        }).catch(err=>{
                            resolve(err.message);
                        })
                    }
                }else{
                    reject("User not found");
                }
            }catch(e){
                reject(e.message);
            }
        })
    },

}