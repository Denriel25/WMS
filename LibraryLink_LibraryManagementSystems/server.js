const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("LibraryLink API Running 🚀");
});

// ROUTES
app.use("/api/books", require("./routes/books"));
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/borrow", require("./routes/borrow"));
app.use("/api/fines", require("./routes/fines"));

app.listen(5000, ()=>{
    console.log("Server running on port 5000");
});