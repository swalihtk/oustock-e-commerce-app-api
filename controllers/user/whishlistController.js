const Whishlist = require("../../models/user/whishlist");
const objectId=require("mongoose").Types.ObjectId;
const Cart=require("../../models/user/cart");

module.exports = {

    // @desc add items to whishlist
    // @params userId, productId
  addToWhishlist:async function (req, res) {
    try {

      let {userId, productId}=req.body;  

      let existingWhishlist = await Whishlist.findOne({ userId: objectId(userId) });
      let existingCart = await Cart.findOne({ userId: objectId(userId) });
      
      if(existingCart){
        await  Cart.updateOne(
          {
            userId: objectId(userId),
          },
          {
            $pull: {
              products: {
                productId: objectId(productId),
              },
            },
          }
        )
      }

      if (existingWhishlist) {
        let existProduct=await Whishlist.findOne({userId:userId, "products.productId" :objectId(productId)});
        if(existProduct){
            res.json({error:"Product Already in whishlist!!"});
            return;
        }
        let response=await Whishlist.updateOne(
          { userId: objectId(userId) },
          {
            $push: {
              products: {
                productId: objectId(productId)
              }
            }
        });
        res.json({response});
      } else {
        let newWhishlist = new Whishlist({
          userId: userId,
          products: [
            {
              productId: objectId(productId)
            },
          ],
        });
        let whislistSave=await newWhishlist.save();
        res.json(whislistSave);
      }
    } catch (e) {
        console.log(e);
        res.json({error:"something went wrong"});
    }
  },

    // @desc get all items in whishlist for user
    getAllItemFromWhishlist:async function(req,res){
        try{
            let userId=req.params.id;
            let response=await Whishlist.aggregate(
                [
                    {
                        $match:{
                            userId:userId
                        }
                    },
                    {
                        $lookup:{
                            from:"products",
                            localField:"products.productId",
                            foreignField:"_id",
                            as:"productInfo"
                        }
                    },
                    {
                        $project:{
                            productInfo:1,
                            _id:0
                        }
                    }
                ]
                )
            res.json(response[0]?.productInfo);
        }catch(e){
            console.log(e);
            res.json({error:e.message});
        }
    },
    
    // @desc remove item from whishlist
    // @params productId, userId
    removeFromWhishlist:async function(req,res){
        try{
            let {userId, productId}=req.body;
            let result=await Whishlist.updateOne({userId:userId},
            {
              $pull:{
                products: {
                  productId:objectId(productId),
                }
              }
              
            }
            )

            res.json(result);
        }catch(e){
            console.log(e);
            res.json({error:"Something went wrong!!"});
        }
    }
};
