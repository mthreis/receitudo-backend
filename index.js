
const express = require("express");
const app = express();

const db = require("./db");
db.connect();

app.use(express.json());
app.use(express.static("build"));

app.use("/recipes", require("./routes/recipes"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Olé. Port: ${ PORT }`));