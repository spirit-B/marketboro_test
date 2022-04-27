const express = require("express");
const connect = require("./schemas/index");
const app = express();

const port = process.env.PORT;
const productRouter = require("./routes/product");
const orderRouter = require("./routes/order");
const userRouter = require("./routes/user");
const findinfoRouter = require("./routes/findUserInfo");
require("dotenv").config();

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", [productRouter, orderRouter, userRouter, findinfoRouter]);
app.listen(port, () => {
    console.log(`http://localhost:${port}에 접속되었습니다.`);
});
