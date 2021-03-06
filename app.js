const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();
const PORT=process.env.PORT;

// dotenv config
dotenv.config();

// app middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit:"50mb"}));
// app.use(fileUpload());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// mongoose connect
mongoose.connect(process.env.MONGODB, (err) => {
  if (err) {
    console.log("Error on connecting to database");
  } else {
    console.log("Database connected");
  }
});

// app routes
app.get("/", (req,res)=>{
  res.send("Outstock E-Commerce App");
})

// admin
const adminAuth = require("./routers/admin/auth");
const adminUserManage = require("./routers/admin/users");
const adminCategoryManage = require("./routers/admin/category");
const adminProductManage = require("./routers/admin/product");
const adminBanner=require("./routers/admin/banner");
const adminOffer=require("./routers/admin/offer");
const adminSalesReport=require("./routers/admin/saleReport");
const adminCoupons=require("./routers/admin/coupons");

app.use("/admin/auth", adminAuth);
app.use("/admin/users", adminUserManage);
app.use("/admin/category", adminCategoryManage);
app.use("/admin/product", adminProductManage);
app.use("/admin/banner", adminBanner);
app.use("/admin/offers", adminOffer);
app.use("/admin/sales_report", adminSalesReport);
app.use("/admin/coupons", adminCoupons);

// home
const homeCategory = require("./routers/home/category");
const productHome = require("./routers/home/products");

app.use("/home/category", homeCategory);
app.use("/home/products", productHome);

// product

// user
const auth = require("./routers/user/auth");
const account = require("./routers/user/account");
const cart = require("./routers/user/cart");
const order = require("./routers/user/order");
const whishlist=require("./routers/user/whishlist");

app.use("/user/auth", auth);
app.use("/user/account", account);
app.use("/user/cart", cart);
app.use("/user/order", order);
app.use("/user/whishlist", whishlist);

// app listening
app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
