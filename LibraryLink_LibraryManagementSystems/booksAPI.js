const express = require("express");
const router = express.Router();

let books = []; // temporary DB (we can upgrade to MySQL later)

// GET ALL BOOKS
router.get("/", (req,res)=>{
    res.json(books);
});

// ADD BOOK
router.post("/", (req,res)=>{
    books.push(req.body);
    res.json({message:"Book added"});
});

// DELETE BOOK
router.delete("/:id",(req,res)=>{
    books.splice(req.params.id,1);
    res.json({message:"Deleted"});
});

module.exports = router;