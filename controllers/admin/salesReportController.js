const order = require("../../models/user/order");
const Order=require("../../models/user/order");

module.exports={
    getSalesReport:function(page, year, month, dateFrom, dateEnd){
        return new Promise(async(resolve,reject)=>{
            try{
                let result=await Order.aggregate([
                    {
                        $unwind:"$orderDetails"
                    },
                    
                    {
                        $project:{
                            reportDate:{$dateToParts:{date:"$orderDetails.date"}},
                            orderDetails:1
                        }
                    },
                    {
                        $match:{
                            "reportDate.year":year,
                            "reportDate.month":month,
                            $and:[
                                {"reportDate.day":{$gte:dateFrom}},
                                {"reportDate.day":{$lte:dateEnd}}
                            ]
                        }
                    },
                    {
                        $skip:page*10-10
                    },
                    {
                        $limit:page*10
                    }
                ]);

                let total=await Order.aggregate([
                    {
                        $unwind:"$orderDetails"
                    },
                    
                    {
                        $project:{
                            reportDate:{$dateToParts:{date:"$orderDetails.date"}},
                            orderDetails:1
                        }
                    },
                    {
                        $match:{
                            "reportDate.year":year,
                            "reportDate.month":month,
                            $and:[
                                {"reportDate.day":{$gte:dateFrom}},
                                {"reportDate.day":{$lte:dateEnd}}
                            ]
                        }
                    },
                    {
                        $count:"total"
                    }
                ]);

                resolve({result, total:total[0].total});
            }catch(e){
                reject({error:e.message});
            }
        })
    },


    getTotalSalesInWeek:async function(req,res){
        try{
            let sales=await Order.aggregate(
                [
                    {
                        $unwind:"$orderDetails"
                    },
                    {
                        $project:{
                            datePart:{
                                $dateToParts:{date:"$orderDetails.date"}
                            },
                            orderDetails:1,
                        }
                    },
                    {
                        $match:{"orderDetails.date":{$gte:new Date(new Date()-7*60*60*24*1000)}}
                    },
                    {
                        $group:{
                            _id:{month:"$datePart.month", day:"$datePart.day", year:"$datePart.year"}, total:{$sum:"$orderDetails.totalPrice"}
                            }
                    },
                    {
                        $sort:{
                            "_id":1
                        }
                    },
                ]
                )
            
            // array
            let priceArray=[];
            let dateArray=[];

            sales.forEach((item)=>{
                priceArray.push(item.total);
                dateArray.push(`${item._id.day}/${item._id.month}/${item._id.year}`);
            })

            res.status(200).json({prices:priceArray, dates:dateArray});
            
        }catch(e){
            res.json({error:e.message});
        }
    },

    getDashboardDatas:async function(req,res){
        try{
            
            const getAllOrders=await Order.aggregate(
                [
                    {
                        $unwind:"$orderDetails"
                    },
                    {
                        $count:"total"
                    }
                ]
                );
            
            const getTotalSales=await Order.aggregate(
                [
                    {
                        $unwind:"$orderDetails"
                    },
                    {
                        $unwind:"$orderDetails.products"
                    },
                    {
                        $group:{
                            _id:"", total:{
                                $sum:"$orderDetails.products.quantity"
                            }
                        }
                    }
                ]
                );
            
            const getTotalRevenue=await Order.aggregate(
                [
                    {
                        $unwind:"$orderDetails"
                    },
                    {
                        $group:{
                            _id:"", total:{
                                $sum:"$orderDetails.totalPrice"
                            }
                        }
                    }
                ]
                );

            const getTotalReturns=await Order.aggregate(
                [
                    {
                        $unwind:"$orderDetails"
                    },
                    {
                        $match:{
                           "orderDetails.status.state":{$regex:"CANCELED"}
                        }
                    },
                    {
                        $count:"total"
                    }
                ]
                );

            let data=await Promise.all([
                getAllOrders,
                getTotalSales,
                getTotalRevenue,
                getTotalReturns
            ])

            let resBody={
                allOrders:data[0][0].total,
                totalSales:data[1][0].total,
                totalRevenue:data[2][0].total,
                totalReturns:data[3][0].total
            }

            res.status(200).json(resBody);

        }catch(e){
            res.json({error:e.message});
        }
    }
}