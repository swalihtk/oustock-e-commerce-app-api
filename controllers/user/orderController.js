const Order=require("../../models/user/order");
const Cart=require("../../models/user/cart");
let objectId=require("mongoose").Types.ObjectId;
const Razorpay = require("razorpay");
let crypto=require("crypto");
const Product=require("../../models/admin/Product");

module.exports={
    addNewOrder:function(userId, address, products, totalPrice, paymentMethod){
        return new Promise(async(resolve,reject)=>{
            try{
                let existingUser=await Order.findOne({userId:userId});

                let productArray=[];
                products.forEach(item=>{
                    let body={
                        productId:objectId(item.productId),
                        quantity:item.quantity
                    }
                    productArray.push(body);
                })

                const productPushAndAction=async _=>{
                    for(let i=0;i<products.length;i++){
                        let body={
                            productId:objectId(products[i].productId),
                            quantity:products[i].quantity
                        }
                        productArray.push(body);
                        let value=parseInt(0-products[i].quantity);
                        await Product.updateOne({_id:objectId(products[i].productId)},{
                            $inc:{
                                quantity:value
                            }
                        })
                    }
                }
                productPushAndAction();
                let orderBody= {address,products:productArray,status:{state:"CONFIRMED", date:new Date()},totalPrice,paymentMethod}

                // for loop decrement
               

                if(!existingUser){
                    let newOrder=new Order({
                        userId,
                        orderDetails:[
                           orderBody
                        ]
                    })
                    await Cart.deleteOne({userId:userId});
                    resolve(newOrder.save());
                }else{
                    let response=await Order.findOneAndUpdate({userId:userId}, {
                        $push:{
                            orderDetails:orderBody
                        }
                    })
                    await Cart.deleteOne({userId:userId});
                    resolve(response);
                }
            
                
            }catch(e){
                reject(e.message);
            }
        })
    },
    changeOrderStatus:function(userId,orderId, status){
        return new Promise(async(resolve,reject)=>{
            try{
                let body={
                    state:status,
                    date:new Date()
                }
                let response=await Order.updateOne(
                    {
                        userId:userId,
                        "orderDetails._id":objectId(orderId)
                    },
                    {
                        $push:{
                            "orderDetails.$.status":body
                        }
                    }
                    );
                resolve(response);
            }catch(e){
                reject(e);
            }
        })
    },

    listAllOrders:function(pageNu){
        return new Promise(async(resolve,reject)=>{
            try{
                if(!pageNu) pageNu=1;
                let allOrders=await Order.aggregate([
                    {
                        $unwind:"$orderDetails"
                    },
                    {
                        $lookup:{
                            from:"products",
                            localField:"orderDetails.products.productId",
                            foreignField:"_id",
                            as:"productInfo"
                        }
                    },
                    {
                        $skip:(pageNu*10-10)
                    },
                    {
                        $limit:(pageNu*10)
                    },
                    {
                        $sort:{
                            "orderDetails.date":-1
                        }
                    }
                    
                ])
                let count=await Order.aggregate([
                    {
                        $unwind:"$orderDetails"
                    },
                    {
                        $count:"total"
                    }
                ])
                resolve({allOrders, total:count[0].total});
            }catch(e){
                reject(e.message);
            }
        })
    },

    listUserOrders:function(userId){
        return new Promise(async(resolve,reject)=>{
            try{
                let allOrders=await Order.aggregate([
                    {
                            $match:{
                                userId:userId
                            }
                    },
                    {
                        $unwind:"$orderDetails"
                    },
                    {
                        $project:{
                            orderDetails:1
                        }
                    },
                    {
                        $sort:{
                            "orderDetails.date":-1
                        }
                    }
                    ]);
                resolve(allOrders);
            }catch(e){
                reject(e.message);
            }
        })
    },
    getOrderdDetails:function(userId, orderId){
        return new Promise(async(resolve,reject)=>{
            try{
                let response=await Order.aggregate(
                    [
                        {
                            $unwind:"$orderDetails"
                         },
                        {
                            $match:{
                                userId:userId,
                                "orderDetails._id":objectId(orderId)
                                }
                        },
                        {
                            $lookup:{
                                from:"products",
                                localField:"orderDetails.products.productId",
                                foreignField:"_id",
                                as:"productsInfo"
                            }
                        }
                    ]
                )
                resolve(response[0]);
            }catch(e){
                reject(e.message);
            }
        })
    },


    /***********PAYMENT INTEGRATION***********/
    razerpayIntegrate:function(amount){
        return new Promise(async(resolve,reject)=>{
            try{
                const instance = new Razorpay({
                    key_id: process.env.RAZERPAY_KEY_ID,
                    key_secret: process.env.RAZERPAY_KEY_SECRET,
                });

                const options = {
                    amount: amount*100, // amount in smallest currency unit
                    currency: "INR",
                    receipt: "receipt_order_74394",
                };

                let order=await instance.orders.create(options);
                resolve(order);
            }catch(e){
                reject({error:e.message});
            }
        })
    },

    razorpaySuccessValidation:function (userId,orderId, razorpayPaymentId, razorpaySignature, address, products, totalPrice){
       
        return new Promise(async(resolve,reject)=>{
            try{
                let generatedSignature=await crypto.createHmac("sha256",process.env.RAZERPAY_KEY_SECRET)
                .update(orderId+"|"+razorpayPaymentId)
                .digest("hex");

                if(generatedSignature===razorpaySignature){
                    let response=await this.addNewOrder(userId, address, products, totalPrice, "Razorpay")
                    resolve(response);
                }else{
                    reject({error:"error"})
                }
            }catch(e){
                reject({error:e.message});
            }
        })
    }
}