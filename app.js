const express = require("express");
const connect = require("./schemas/index");
const app = express();

const port = 3000;
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
require('dotenv').config();

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", [productRouter, orderRouter]);
app.listen(port, () => {
    console.log(`http://localhost:${port}에 접속되었습니다.`);
})