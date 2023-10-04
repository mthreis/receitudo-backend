
const express = require("express");
const app = express();

const db = require("./db");
db.connect();

app.use(express.json());

app.use("/recipes", require("./routes/recipes"));
app.use("/users", require("./routes/users"));


app.listen(4007, () => console.log("olé"));