const CouponModel=require("../../models/admin/Coupons");
const UserModel=require("../../models/user/users");
const objectId=require("mongoose").Types.ObjectId;

module.exports={

    // @desc    create new coupon
    // @params  couponsCode, expires, discount
    createCoupon:async function(req,res){
        try{
            let {couponCode, expires, discount} =req.body;

            let existingCoupon=await CouponModel.findOne({couponCode:couponCode});

            if(!existingCoupon){    
                let newCoupon=new CouponModel({
                    couponCode,
                    expires,
                    discount
                })
                let response=await newCoupon.save();
                res.status(201).json(response);
            }else{
                res.json({error:"Couponcode already exists!"});
            }
        }catch(e){
            res.json({error:e.message});
        }
    },

    // @desc    delete coupon
    deleteCoupon:async function(req,res){
        try{
            let response=await CouponModel.deleteOne({_id:req.params.id});
            res.status(200).json(response);
        }catch(e){
            res.json({error:e.message});
        }
    },

    // @desc    edit coupon
    // @params  couponCode, expires, discount, id
    editCoupon:async function(req,res){
        try{
            let {id, expires, discount}=req.body;
           
            let updateResponse=await CouponModel.updateOne({_id:id}, {$set:{
                discount:discount,
                expires:expires
            }});
            res.status(201).json(updateResponse);
        }catch(e){
            res.json({error:e.message});
        }
    },
    
    // @desc    apply coupon
    // @params  userId, couponCode, totalPrice, 
    applyCoupon:async function(req,res){
        try{
                
            // body params
            let {userId, couponCode, totalPrice}=req.body;

            // expiring coupons
            const expireCoupon=async _=>{
                let currentDate=JSON.stringify(new Date()).substr(1,10);
                await CouponModel.deleteMany({expires:{$lt:currentDate}});
            }
            expireCoupon();

            // getting coupon details
            let coupon=await CouponModel.findOne({couponCode:couponCode});

            // checking coupon is exist or not
            if(!coupon){
                res.json({error:"Coupon not found!!"});
                return;
            }

            // check the coupon already applyied or not
            let hasApplyied=await UserModel.findOne({_id:userId, "coupons.id":coupon._id});
            if(!hasApplyied){
                await UserModel.updateOne({_id:userId}, {$push:{
                    coupons:{id:coupon._id}
                }})
                let newPrice=totalPrice-(totalPrice*coupon.discount/100);
                res.status(200).json({newPrice:newPrice});
            }else{
                res.json({error:"Coupon already applied"})
            }
        }catch(e){
            res.json({error:e.mesage});
        }
    },

    // @desc    list all coupons
    getAllCoupons:async function(req,res){
        try{
            let {page} =req.params;
            if(!page) page=1;

            let response=await CouponModel.find({}).skip(page*10-10).limit(page*10);
            res.status(200).json(response); 
        }catch(e){
            res.status(400).json({error:e.message});
        }
    },

    // @desc    get one coupon details
    // @params id
    getOneCoupon:async function(req,res){
        try{
            let id=req.params.id;
            let response=await CouponModel.findOne({_id:id});
            res.status(200).json(response);
        }catch(e){
            res.json({error:e.message});
        }
    }
}