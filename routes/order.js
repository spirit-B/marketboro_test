const express = require("express");
const router = express.Router();
const Order = require("../schemas/orderSchema");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 주문하기
router.post("/order", async (req, res) => {
    const { orderer, orderHistory } = req.body;

    try {
        await Order.create({ orderer, orderHistory });
        res.status(200).send({ message: "주문이 접수되었습니다." });
    } catch (error) {
        res.status(400).send({ message: "오류가 발생했습니다." });
    }
});

// 주문 부분 취소
router.patch("/order/:orderId", async (req, res) => {
    const { orderId } = req.params;
    const { orderHistory } = req.body;

    try {
        await Order.updateOne({ _id: orderId }, { $set: { orderHistory } });
        res.status(200).send({ message: "해당 주문을 취소했습니다." });
    } catch (error) {
        res.status(400).send({ message: "올바르지 않은 접근입니다." });
    }
});

module.exports = router;
