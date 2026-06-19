const express = require("express");
const router = express.Router();

let users = [];

router.get("/", (req,res)=>{
    res.json(users);
});

router.post("/", (req,res)=>{
    users.push(req.body);
    res.json({message:"User added"});
});

router.delete("/:id",(req,res)=>{
    users.splice(req.params.id,1);
    res.json({message:"User deleted"});
});

module.exports = router;