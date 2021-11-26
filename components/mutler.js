const multer=require("multer");
const path=require("path");
const {CloudinaryStorage }=require("multer-storage-cloudinary");
const cloudinary=require("./cloudinary");

const storage =new  CloudinaryStorage ({
    cloudinary:cloudinary,
    params:{
        folder:"Outstock_Banner",
    },
    });

module.exports=multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
        let ext=path.extname(file.originalname);

        if(ext !== ".jpg" && ext !==".jpeg" && ext !== ".png"){
            cb(new Error("File type not supported"));
            return;
        }
        cb(null, true);
    }
})