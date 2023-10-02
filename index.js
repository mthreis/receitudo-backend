console.log("ole");

const express = require("express");

const app = express();

app.use("/", (req, res) => {
    res.json({message: "ok"});
});


app.listen(4007);