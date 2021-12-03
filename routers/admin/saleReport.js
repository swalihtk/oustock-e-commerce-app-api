const router=require("express").Router()
const reportHelper=require("../../controllers/admin/salesReportController");

router.get("/", (req,res)=>{
    let {page, year, month, startDay, endDay}=req.query;

    let date=new Date();
    if(!page) page=1;
    if(!year) year=date.getFullYear();
    if(!month) month=date.getMonth()+1;
    if(!startDay) startDay=1;
    if(!endDay) endDay=31;
    
    reportHelper.getSalesReport(parseInt(page), parseInt(year), parseInt(month), parseInt(startDay), parseInt(endDay)).then(response=>{
        res.status(200).json(response);
    }).catch(e=>{
        res.json(e);
    })
})

module.exports=router;