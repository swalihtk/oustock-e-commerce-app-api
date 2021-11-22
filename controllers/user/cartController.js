const Cart = require("../../models/user/cart");
const objectId = require("mongoose").Types.ObjectId;

module.exports = {
  addToCart: function (userId, productId) {
    return new Promise(async (resolve, reject) => {
      try {
        let existingCart = await Cart.findOne({ userId: objectId(userId) });

        if (existingCart) {
          let existingProduct = await Cart.findOne({
            userId: objectId(userId),
            "products.productId": objectId(productId),
          });

          if (existingProduct) {
            Cart.updateOne(
              {
                userId: objectId(userId),
                "products.productId": objectId(productId),
              },
              {
                $inc: {
                  "products.$.quantity": 1,
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
            Cart.updateOne(
              { userId: objectId(userId) },
              {
                $push: {
                  products: {
                    productId: productId,
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
          }
        } else {
          let newCart = new Cart({
            userId: userId,
            products: [
              {
                productId: productId,
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
          Cart.updateOne(
            {
              userId: objectId(userId),
              "products.productId": objectId(productId),
            },
            {
              $inc: {
                "products.$.quantity": 1,
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
          await Cart.updateOne(
            {
              userId: objectId(userId),
              "products.productId": objectId(productId),
              "products.quantity": {
                $gt: 0,
              },
            },
            {
              $inc: {
                "products.$.quantity": -1,
              },
            }
          );

          await Cart.updateOne(
            {
              userId: objectId(userId),
              "products.productId": objectId(productId),
              "products.quantity": {
                $eq: 0,
              },
            },
            {
              $pull: {
                products: {
                  productId: objectId(productId),
                },
              },
            }
          );
          resolve("success");
        }
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
};
