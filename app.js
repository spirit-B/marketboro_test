const express = require("express");
const connect = require("./schemas/index");
const app = express();

const port = 3000;
const product_router = require("./routes/product");
require('dotenv').config();

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", [product_router]);
app.listen(port, () => {
    console.log(`http://localhost:${port}에 접속되었습니다.`);
})