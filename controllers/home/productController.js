const Product = require("../../models/admin/Product");

module.exports = {
  listLatestProduct: function () {
    return new Promise(async (resolve, reject) => {
      try {
        let latestProducts = await Product.find({})
          .sort({ createdAt: -1 })
          .limit(8);
        resolve(latestProducts);
      } catch (e) {
        reject(e.message);
      }
    });
  },

  // list product one details
  productDetails: function (productId) {
    return new Promise(async (resolve, reject) => {
      try {
        let productDetails = await Product.findOne({ _id: productId });
        resolve(productDetails);
      } catch (e) {
        reject(e.message);
      }
    });
  },

  // list product in main category
  productListMain: function (categoryName) {
    return new Promise(async (resolve, reject) => {
      try {
        let allProducts = await Product.find({ category: categoryName });
        resolve(allProducts);
      } catch (e) {
        reject(e.message);
      }
    });
  },

  // list products in sub category
  productListSub: function (categoryName, subCatName) {
    return new Promise(async (resolve, reject) => {
      try {
        let allProducts = await Product.find({
          category: categoryName,
          subCategory: subCatName,
        });
        resolve(allProducts);
      } catch (err) {
        reject(err.message);
      }
    });
  },

  // search products
  searchProducts: (productName) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!productName) {
          productName = " ";
        }
        let searchResults = await Product.find({
          name: { $regex: productName, $options: "i" },
        });
        resolve(searchResults);
      } catch (e) {
        reject(e.message);
      }
    });
  },

  // offer products
  getOfferProducts:(forBanner, pageNum)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        if(forBanner){
          let offerdProducts=await Product.find({offer:{$exists:true}}).limit(8);
          resolve(offerdProducts);
        }else{
          let offerdProducts=await Product.find({offer:{$exists:true}}).skip(pageNum*10-10).limit(pageNum*10);
          let count=await Product.find({offer:{$exists:true}}).count();
          resolve({products:offerdProducts, total:count});
        }
      }catch(e){
        reject({error:e.message});
      }
    })
  }
};
