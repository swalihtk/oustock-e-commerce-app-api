const router = require("express").Router();
const accountController = require("../../controllers/user/accountController");
const referalController=require("../../controllers/user/referalController");

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

router.get("/address/getOne/:userId/:addressId", (req,res)=>{
    accountController.getOneAddress(req.params.userId, req.params.addressId).then(response=>{
        res.status(200).json(response);
    }).catch(e=>{
        res.json(e);
    })
})

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
        res.json(err);
    })
})

// edit address
router.put("/address/edit", (req, res)=>{
    let {userId, addressId}=req.query;
    
    accountController.editAddress(userId, addressId, req.body).then(response=>{
        res.status(201).json(response);
    }).catch(err=>{
        res.json(err);
    })
})

// change account information
router.put("/changeDetails/:id", (req,res)=>{
    let {firstName, lastName, username, email, existingEmail}=req.body;
    accountController.editUserDetails(req.params.id,firstName, lastName, username, email, existingEmail).then(response=>{
        res.status(201).json(response);
    }).catch(e=>{
        res.json(e);
    });
})

// change user password
router.put("/changePassword/:id", (req, res)=>{
    let {verifyPassword, newPassword}=req.body;
    accountController.changeUserPassword(req.params.id, verifyPassword, newPassword).then(response=>{
        res.status(201).json(response);
    }).catch(e=>{
        res.json(e);
    })
})

// change user profile image
router.put("/changeProfileImage/:id", (req,res)=>{
    let {image}=req.body;
    accountController.changeProfilePic(req.params.id, image).then(response=>{
        res.status(201).json(response);
    }).catch(e=>{
        res.status(401).json(e);
    })
})

// @desc  apply referal code
// @params  referal
router.post("/applyReferal", referalController.applyReferal);

module.exports = router;
