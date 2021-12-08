const Users = require("../../models/user/users");
const objectId=require("mongoose").Types.ObjectId;
const crypto=require("crypto");
const cloudinary=require("../../components/cloudinary");

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

  editUserDetails:async(id,firstname, lastname, username, email,existingEmail)=>{
    return new Promise(async(resolve,reject)=>{
      try{
       
        if(email!==existingEmail){
          let existingUserWithEmail=await Users.findOne({email:email});
          if(existingUserWithEmail){
            reject({error:"Email already registerd"});
            return;
          }
        }

        let response=await Users.updateOne({_id:id}, {
          $set:{
            firstname:firstname,
            lastname:lastname,
            username:username,
            email:email
          }
        })

        resolve(response);
      }catch(e){
        reject({error:e.message});
      }
    })
  },

  changeUserPassword:function(id, verifyPassword, newPassword){
    return new Promise(async(resolve,reject)=>{
      try{
        let password = crypto
            .createHmac("sha256", verifyPassword)
            .update("secret")
            .digest("hex");
        let existingUser=await Users.findOne({_id:id, password:password});
        if(!existingUser){
          reject({err:"Password verification failed!"});
        }

        let newPasswordHash=crypto.createHmac("sha256", newPassword).update("secret").digest("hex");
        let response=await Users.updateOne({_id:id}, {
          $set:{
            password:newPasswordHash
          }
        })
        resolve(response);
      }catch(e){
        reject({err:e.message});
      }
    })
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

  changeProfilePic:function(id, profileImage){
    return new Promise(async(resolve,reject)=>{
      try{
        let response=await cloudinary.uploader.upload(profileImage, {
          upload_preset:"pezo4etc"
        });

        let updateResponse=await Users.updateOne({_id:id},{
          $set:{
            profileImage:response.secure_url
          }
        })

        resolve(updateResponse);
      }catch(e){
        reject(e.message);
      }
    })
  }
  ,

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
            reject({error:e.message});
          }
      })
  },

  // get Address detals
  getOneAddress:function(userId, addressId){
    return new Promise(async(resolve,reject)=>{
      try{
        let address=await Users.aggregate([
          {
              $unwind:"$address"
          },
          {
              $match:
              {
                  _id:objectId(userId),
                  "address._id":objectId(addressId)
              }
          },
          {
              $project:{
                  address:1
              }
          }
          ])
        resolve(address[0].address);
      }catch(e){
        reject({error:e.message});
      }
    })
  }
};
