const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const routes = require("./routes");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

app.use(express.static(__dirname + "/client/views"));
app.use("/views", express.static(__dirname + "/client/views"));
app.use("/static", express.static(__dirname + "/client/static"));

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});

const db = require('./services/db');
db.initDb();