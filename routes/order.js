const express = require("express");
const router = express.Router();
const Order = require("../schemas/orderSchema");
const auth = require("../middlewares/auth-middleware");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 주문하기
router.post("/order", auth, async (req, res) => {
    try {
        for (let order of req.body) {
            const { orderer, productId, productName, orderQuantity } = order;
            await Order.create({ orderer, productId, productName, orderQuantity });
        }
        res.status(200).send({ message: "주문이 접수되었습니다." });
    } catch (error) {
        return res.status(400).send({ message: "오류가 발생했습니다." });
    }
});

// 주문 부분 취소
router.delete("/order/:orderId", auth, async (req, res) => {
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    try {
        if (order.orderState === "배송완료") 
            return res.status(200).send({ message: "이미 배송이 완료된 상품입니다." });
        await Order.deleteOne({ _id: orderId });
        res.status(200).send({ message: "해당 주문을 취소했습니다." });
    } catch (error) {
        return res.status(400).send({ message: "올바르지 않은 접근입니다." });
    }
});

module.exports = router;
