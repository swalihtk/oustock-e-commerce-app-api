const router = require("express").Router();
const orderControll=require("../../controllers/user/orderController");

// add new order
router.post("/add", (req, res) => {

    /** Parmas */
    /**
     * userId==string, 
     * address==object(), 
     * products==array(), 
     * totalPrice===number
     * paymentMethod
     */

    let {userId, address, products, totalPrice,paymentMethod}=req.body;
    orderControll.addNewOrder(userId, address, products, totalPrice, paymentMethod).then(response=>{
        res.status(201).json(response);
    }).catch(err=>{
        console.log(err);
        res.status(401).json(err);
    })
});

// admin
// change status
router.post("/changeStatus", (req,res)=>{

    let {userId, orderId, status}=req.body
    orderControll.changeOrderStatus(userId, orderId, status).then(response=>{
        res.status(201).json(response);
    }).catch(err=>{
        res.status(401).json(err);
    })
})

// admin
// list all orders
router.get("/listAll", (req,res)=>{
    let {page}=req.query;
    orderControll.listAllOrders(page).then(response=>{
        res.status(200).json(response);
    }).catch(e=>{
        res.status(400).send(e);
    })
})

// user
// list user orders
router.get("/listUserOrders/:userId", (req,res)=>{

    orderControll.listUserOrders(req.params.userId).then(response=>{
        res.status(200).json(response);
    }).catch(e=>{
        res.status(400).send(e);
    })
})

// user
// get order details
router.get("/getProductDetails/:userId/:orderId", (req, res)=>{
    orderControll.getOrderdDetails(req.params.userId, req.params.orderId).then(response=>{
        res.status(200).json(response);
    }).catch(err=>{
        res.status(400).json(err);
    })
})

/******* PAYMENT *******/

// razerpay
router.post("/razorpay", (req,res)=>{
    let {amount}=req.body;
    orderControll.razerpayIntegrate(amount).then(response=>{
        res.status(200).json(response);
    }).catch(err=>{
        res.json(err);
    })
})

router.post("/razorpay/success", (req, res)=>{
    let {userId,orderId, razorpayPaymentId, razorpaySignature, address, totalPrice, products}=req.body;
    orderControll.razorpaySuccessValidation(userId,orderId, razorpayPaymentId, razorpaySignature, address, products, totalPrice).then(response=>{
        res.status(200).json(response);
    }).catch(e=>{
        res.json(e);
    })
})

module.exports = router;
