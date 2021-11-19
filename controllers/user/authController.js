const userSchema = require("../../models/user/users");
const crypto = require("crypto");

module.exports = {
  createUser: function (body) {
    return new Promise(async (resolve, reject) => {
      try {
        let existingUser = await userSchema.findOne({ email: body.email });

        if (existingUser) {
          reject("error");
        } else {
          let password = crypto
            .createHmac("sha256", body.password)
            .update("secret")
            .digest("hex");

          let user = new userSchema({
            username: body.username,
            email: body.email,
            password: password,
          });
          let saveuser = await user.save();
          resolve(saveuser);
        }
      } catch (e) {
        console.log(e);
        reject("error");
      }
    });
  },
  signin: function (body) {
    return new Promise(async (resolve, reject) => {
      try {
        let existingUser = await userSchema.findOne({ email: body.email });

        if (existingUser && existingUser.role === "user") {
          let password = crypto
            .createHmac("sha256", body.password)
            .update("secret")
            .digest("hex");

          if (existingUser.isActive === false) {
            reject({ blocked: true });
          }

          if (password === existingUser.password) {
            resolve(existingUser);
          } else {
            reject({ validatFail: true });
          }
        } else {
          reject({ usernotfound: true });
        }
      } catch (e) {
        reject("error");
      }
    });
  },

  userFindOne: function (userId) {
    return new Promise(async (resolve, reject) => {
      let user = await userSchema.findOne({ _id: userId });
      if (user) {
        resolve(user);
      } else {
        reject("User not found");
      }
    });
  },
};
