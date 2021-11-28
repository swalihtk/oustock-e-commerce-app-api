const Banner=require("../../models/admin/Banner");
const cloudinary=require("../../components/cloudinary");

module.exports={
    createBanner:function(title, linkUrl, image){
        return new Promise(async(resolve,reject)=>{
            try{
                let cloudResponse=await cloudinary.uploader.upload(image, {
                    upload_preset:"pezo4etc"
                });
                let banner=new Banner({
                    poster_image:cloudResponse.secure_url,
                    title:title,
                    link:linkUrl
                })
                resolve(banner.save());
            }catch(e){
                reject(e.message);
            }
        })
    },

    listAllBanners:function(pageNu, sortValue){
       
        return new Promise(async(resolve,reject)=>{
            try{   
               
                let allBanners=await Banner.find({}).sort({createdAt:sortValue}).skip(pageNu*10-10).limit(pageNu*10);
                let totalLength=await Banner.find({}).count();
                resolve({allBanners, totalLength});
            }catch(e){
                resolve(e.message);
            }
        })
    },

    deleteBanner:function(bannerId){
        return new Promise(async(resolve,reject)=>{
            try{
                let response=await Banner.deleteOne({_id:bannerId});
                resolve(response);
            }catch(e){
                resolve(e.message);
            }
        })
    }
}