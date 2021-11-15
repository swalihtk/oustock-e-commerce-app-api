const Category=require("../../models/admin/Category");

module.exports={

    // add to category
    addCategory:function({mainCategoryName, subCategoryArray}){
        return new Promise(async(resolve,reject)=>{
            try{
                let existingCategory=await Category.findOne({categoryName:mainCategoryName});      

                if(existingCategory){
                    Category.updateOne({categoryName:mainCategoryName}, {$push:{
                        subCategery:{
                            $each:subCategoryArray
                        }
                    }}).then(response=>{
                        resolve(response);
                    }).catch(err=>{
                        reject(err.message);
                    })
                }else{

                    // creating new category
                    let categoryObject={
                        categoryName:mainCategoryName,
                        subCategery:subCategoryArray
                    }
                    let categorySave=new Category(categoryObject);
                    let saved=categorySave.save()
                    resolve(saved);
                }
            }catch(e){
                reject(e.message);
            }
        })
    },

    // list all items in categry
    listCategory:()=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let allItems=await Category.find({});
                resolve(allItems);
            }catch(e){
                reject(e.message);
            }
        })
    },

    // list sub category
    listSubCategory:(categoryName)=>{
        return new Promise(async(resolve, reject)=>{
            try{
                let allItems=await Category.findOne({categoryName:categoryName});
                resolve(allItems);
            }catch(e){
                reject(e.message);
            }
        })
    },

    // delete main category
    deleteMainCategory:(categoryName)=>{
        return new Promise(async(resolve, reject)=>{
            try{
                
                Category.deleteOne({categoryName:categoryName}).then(response=>{
                    resolve(response);
                }).catch(err=>{
                    reject(err);
                });
                
            }catch(err){
                reject(err.message);
            }
        })
    },


    // delete sub category
    deleteSubCategory:({categoryName, subName})=>{
        return new Promise(async(resolve, reject)=>{
            try{
                Category.updateOne({categoryName:categoryName}, {
                    $pull:{
                        subCategery:subName
                    }
                }).then(response=>{
                    resolve(response);
                }).catch(err=>{
                    reject(err);
                })
            }catch(e){
                reject(e.message);
            }
        })
    }
}