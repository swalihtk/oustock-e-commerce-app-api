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
    }
}