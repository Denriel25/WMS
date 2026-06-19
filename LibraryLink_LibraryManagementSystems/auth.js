const express = require("express");
const router = express.Router();

let users = [];

router.post("/signup",(req,res)=>{
    users.push(req.body);
    res.json({message:"User registered"});
});

router.post("/login",(req,res)=>{
    const user = users.find(u => u.email === req.body.email);
    
    if(user){
        res.json({message:"Login success"});
    }else{
        res.status(400).json({message:"Invalid credentials"});
    }
});

module.exports = router;