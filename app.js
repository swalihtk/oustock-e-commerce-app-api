const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();

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

app.use("/api/admin/auth", adminAuth);
app.use("/api/admin/users", adminUserManage);
app.use("/api/admin/category", adminCategoryManage);
app.use("/api/admin/product", adminProductManage);
app.use("/api/admin/banner", adminBanner);
app.use("/api/admin/offers", adminOffer);
app.use("/api/admin/sales_report", adminSalesReport);
app.use("/api/admin/coupons", adminCoupons);

// home
const homeCategory = require("./routers/home/category");
const productHome = require("./routers/home/products");

app.use("/api/home/category", homeCategory);
app.use("/api/home/products", productHome);

// product

// user
const auth = require("./routers/user/auth");
const account = require("./routers/user/account");
const cart = require("./routers/user/cart");
const order = require("./routers/user/order");
const whishlist=require("./routers/user/whishlist");

app.use("/api/user/auth", auth);
app.use("/api/user/account", account);
app.use("/api/user/cart", cart);
app.use("/api/user/order", order);
app.use("/api/user/whishlist", whishlist);

// app listening
app.listen(process.env.PORT, () =>
  console.log("Server running on port " + process.env.PORT)
);
