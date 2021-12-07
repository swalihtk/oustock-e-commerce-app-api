const router=require("express").Router();
const couponController=require("../../controllers/admin/couponController");

// @desc    create new coupon
// @params  couponsCode, expires, discount
router.post("/create", couponController.createCoupon);

// @desc    edit coupon
// @params  expires, discount, id
router.put("/edit", couponController.editCoupon);

// @desc    delete coupon
router.delete("/delete/:id", couponController.deleteCoupon);

// @desc    apply coupon
// @params  userId, couponCode, totalPrice,
router.post("/apply", couponController.applyCoupon);

// @desc    list all coupons
// @params  page
router.get("/list", couponController.getAllCoupons);

// @desc    list one coupon
// @params  id
router.get("/list/:id", couponController.getOneCoupon);

module.exports=router;