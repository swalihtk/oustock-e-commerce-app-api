const Category = require("../../models/admin/Category");

module.exports = {
  listAllCategory: function () {
    return new Promise(async (resolve, reject) => {
      try {
        let categoryList = await Category.find({});
        resolve(categoryList);
      } catch (e) {
        reject(e.message);
      }
    });
  },
};
