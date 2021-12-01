const Cart = require("../../models/user/cart");
const objectId = require("mongoose").Types.ObjectId;
const Product = require("../../models/admin/Product");

module.exports = {
  addToCart: function (userId, productId) {
    return new Promise(async (resolve, reject) => {
      try {
        let existingCart = await Cart.findOne({ userId: objectId(userId) });

        if (existingCart) {
          Cart.updateOne(
            { userId: objectId(userId) },
            {
              $push: {
                products: {
                  productId: objectId(productId),
                  quantity: 1,
                },
              },
            }
          )
            .then((response) => {
              resolve(response);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          let newCart = new Cart({
            userId: userId,
            products: [
              {
                productId: objectId(productId),
                quantity: 1,
              },
            ],
          });
          resolve(newCart.save());
        }
      } catch (e) {
        reject(e.message);
      }
    });
  },

  // quantiy manager
  quantityManager: function (userId, productId, action) {
    return new Promise(async (resolve, reject) => {
      try {
        if (action === 1) {
          let item = await Cart.aggregate([
            {
              $unwind: "$products",
            },
            {
              $match: {
                userId: userId,
                "products.productId": objectId(productId),
                "products.quantity": { $lt: 3 },
              },
            },
          ]);

          if (item.length < 1) {
            resolve(item);
            return;
          }

          // checking quantity
          let product=await Product.findOne({_id:productId});
          
          if(product.quantity<=item[0].products.quantity){
            resolve("Quantity limited..");
            return;
          }

          await Cart.updateOne(
            {
              userId: objectId(userId),
              "products.productId": objectId(productId),
            },
            {
              $inc: {
                "products.$.quantity": 1,
              },
            }
          );
        } else {
          let item = await Cart.aggregate([
            {
              $unwind: "$products",
            },
            {
              $match: {
                userId: userId,
                "products.productId": objectId(productId),
                "products.quantity": { $gte: 2 },
              },
            },
          ]);

          if (item.length < 1) {
            resolve(item);
            return;
          }
          
          await Cart.updateOne(
            {
              userId: objectId(userId),
              "products.productId": objectId(productId),
            },
            {
              $inc: {
                "products.$.quantity": -1,
              },
            }
          );
        }

        resolve("Count changed");
      } catch (err) {
        reject(err.message);
      }
    });
  },

  // delete product from cart
  delteProductFromCart: function (userId, productId) {
    return new Promise(async (resolve, reject) => {
      console.log("dl", userId, productId);

      try {
        Cart.updateOne(
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
          .then((response) => {
            resolve(response);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (e) {
        reject(e.message);
      }
    });
  },

  // get cart product
  getAllItemsInCart: function (userId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!userId) resolve({ prdouctDetails: [], count: 0 });

        let allItems = await Cart.aggregate([
          {
            $match: {
              userId: userId,
            },
          },
          {
            $unwind: "$products",
          },

          {
            $lookup: {
              from: "products",
              localField: "products.productId",
              foreignField: "_id",
              as: "productInfo",
            },
          },

          {
            $unwind: "$productInfo",
          },

          {
            $addFields: {
              totalPrice: {
                $multiply: ["$products.quantity", "$productInfo.price"],
              },
            },
          },
          {
            $project: {
              _id: 0,
              userId: 0,
              createdAt: 0,
              updatedAt: 0,
            },
          },
        ]);

        resolve({ prdouctDetails: allItems, count: allItems.length });
      } catch (e) {
        reject(e.message);
      }
    });
  },
};
