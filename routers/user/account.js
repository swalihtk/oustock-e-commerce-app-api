const router = require("express").Router();
const accountController = require("../../controllers/user/accountController");

router.get("/details/:userId", (req, res) => {
  accountController
    .getUserDetails(req.params.userId)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/address/list/:userId", (req, res) => {
    accountController.getUserAddresses(req.params.userId).then(response=>{
        res.status(200).json(response);
    }).catch(e=>{
        res.status(400).send(e);
    })
});

router.post("/address/add", (req, res) => {
//   userId
//   fullName:String,
//   locality:String,
//   mobileNu:String,
//   pinCode:String,
//   address:String,
//   town:String,
//   state:String,
//   landmark:String

  accountController.addNewAddress(req.body).then(response=>{
    res.status(201).json(response);
  }).catch(err=>{
      res.status(401).json(err);
  })
});

// delete
router.delete("/address/delete",(req,res)=>{
    let {userId, addressId}=req.query;

    accountController.deleteAddress(userId, addressId).then(response=>{
        res.status(201).json(response);
    }).catch(err=>{
        res.status(401).json(err);
    })
})

// edit address
router.put("/address/edit", (req, res)=>{
    let {userId, addressId}=req.query;
    
    accountController.editAddress(userId, addressId, req.body).then(response=>{
        res.status(201).json(response);
    }).catch(err=>{
        res.status(401).send(err);
    })
})

module.exports = router;
