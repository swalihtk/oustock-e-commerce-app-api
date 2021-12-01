const Offer=require("../../models/admin/offer");
const Product = require("../../models/admin/Product");

module.exports={
    addOffer:function(offerName, offerExpireDate, percentage){
        return new Promise(async(resolve,reject)=>{
            try{
                let saveModel=new Offer({
                    offerName:offerName,
                    percentage:percentage,
                    expireDate:offerExpireDate
                });

                resolve(saveModel.save());
            }catch(e){
                reject({err:e.message});
            }
        })
    },

    deleteOffer:function(offerId){
        return new Promise(async(resolve,reject)=>{
            try{
                let response=await Offer.deleteOne({_id:offerId});
                resolve(response);
            }catch(e){
                reject({error:e.message})
            }
        })
    },

    editOffer:function(offerId, offerName, offerExpireDate, percentage){
        return new Promise(async(resolve,reject)=>{
            try{
                let response=await Offer.updateOne({_id:offerId}, {
                    $set:{
                        offerName:offerName,
                        percentage:percentage,
                        expireDate:offerExpireDate
                    }
                })
                resolve(response);
            }catch(e){
                reject({error:e.message});
            }
        })
    },

    listAllOffers:function(pageNum){
        return new Promise(async(resolve,reject)=>{
            try{
                let response=await Offer.find({}).skip(pageNum*10-10).limit(pageNum*10).sort({updatedAt:-1});
                let total=await Offer.find({}).count();
                resolve({offers:response, total:total});
            }catch(e){
                reject({error:e.mesage});
            }
        })
    },

    getOneOfferDetails:function(offerId){
        return new Promise(async(resolve,reject)=>{
            try{
                let response=await Offer.findOne({_id:offerId});
                resolve(response);
            }catch(e){
                reject({error:e.message});
            }
        })
    },
    
    setOfferForProduct:function(productId, offerName, offerPercentage, offerId, expires){
        return new Promise(async(resolve,reject)=>{
            try{
                // offer:{
                //     offerPrice:{type:Number},
                //     expireDate:{type:String},
                //     offerName:{type:String},
                //     offerId:{type:String}
                //   }
                let product=await Product.findOne({_id:productId});
                let newPrice=product.price*offerPercentage/100;
                
                let response=await Product.updateOne({_id:productId}, {
                    $set:{
                        offer:{
                            offerPrice:newPrice,
                            expireDate:expires,
                            offerName:offerName,
                            offerId:offerId
                        }
                    }
                })
                resolve(response);
            }catch(e){
                reject({error:e.mesage});
            }
        })
    },

    checkOfferExpires:function(date){
        return new Promise(async(resolve,reject)=>{
            try{
                let currentDate=date.toJSON().substr(0, 10);
                let offers=await Offer.find({expireDate:{$lt:currentDate}})

                if(offers.length>0){
                    const forAsync=async _=>{
                        for(let i=0;i<offers.length;i++){
                            await Product.updateOne({"offer.offerId":offers[i]._id}, 
                            {
                                $unset:{
                                    offer:""
                                }
                            }
                            )
                            await Offer.deleteOne({_id:offers[i]._id}); 
                        }
                        resolve({success:true});
                    }
                    forAsync();
                }else{
                    resolve("nothing");
                }
            }catch(e){
                reject({error:e.message});
            }
        })
    }
}