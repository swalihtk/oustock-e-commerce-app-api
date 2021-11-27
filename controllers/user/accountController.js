const Users = require("../../models/user/users");
const objectId=require("mongoose").Types.ObjectId;

module.exports = {
  getUserDetails: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let userDetails = await Users.findOne({ _id: userId });
        resolve(userDetails);
      } catch (e) {
        reject(e.message);
      }
    });
  },

  getUserAddresses: (userId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let response=await Users.aggregate([
                {
                        $match:{
                            _id:objectId(userId)
                        }
                 },
                 
                 {
                     $unwind:"$address"
                 },
                 {
                     $project:{
                         address:1
                     }
                 }
                ]);
            resolve(response);
        }catch(e){
            reject(e.message);
        }
    });
  },

  // add new address
  addNewAddress: ({userId,fullName,mobileNu,pincode,address,town,state,landmark,}) => {
      return new Promise(async(resolve,reject)=>{
          try{
            let addressBody={fullName,mobileNu,pincode,address,town,state,landmark}
            let existingAddress=await Users.findOne({_id:userId});
            
            if(existingAddress.address.length>=4){
              await Users.updateOne({_id:userId}, {
                $pop:{
                  address:-1
                }
              });
              let response=await Users.updateOne({_id:userId}, {
                $push:{
                    address:addressBody
                  }
              })
              resolve(response);
            }else{
              let response=await Users.updateOne({_id:userId}, {
                $push:{
                    address:addressBody
                  }
              })
              resolve(response);
            }
          }catch(e){
            reject(e.message);
          }
      })
  },

  // delete address
  deleteAddress:(userId, addressId)=>{
      return new Promise(async(resolve,reject)=>{
          try{
            let response=await Users.updateOne({_id:userId},
            {
                $pull:{
                    "address":{_id:addressId}
                }
            }
            );
            resolve(response);
          }catch(e){
            reject(e.message);
          }
      })
  },

  // edit address
  editAddress:(userId, addressId, body)=>{
      return new Promise(async(resolve,reject)=>{
          try{
            let response=await Users.updateOne({_id:userId, "address._id":addressId},
            {
                $set:{
                    "address.$":body
                }
            }
            )

            resolve(response);
          }catch(e){
            reject(e.message);
          }
      })
  }
};
