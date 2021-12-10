const router=require("express").Router();
const whishlistController=require("../../controllers/user/whishlistController");

// @desc add items to whishlist
// @params userId, productId
router.post("/", whishlistController.addToWhishlist);

// @desc get items accoding to userId
// @params userId
router.get("/:id", whishlistController.getAllItemFromWhishlist);

// @desc remove item from whishlist
// @params productId, userId
router.put("/", whishlistController.removeFromWhishlist);

module.exports=router;
