const express = require("express");
const router = express.Router();
const Product = require("../schemas/productSchema");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 상품 등록
router.post("/product", async (req, res) => {
    const { productName, price, quantity, seller } = req.body;

    try {
        await Product.create({ productName, price, quantity, seller });
        res.status(200).send({ message: "상품 등록을 완료했습니다." });
    } catch (error) {
        return res.status(401).send({ message: "상품 등록에 실패했습니다." });
    }
});

// 상품 조회
router.get("/:productId", async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findOne({ _id: productId });

    try {
        if (!product) return res.status(404).send({ message: "존재하지 않는 상품입니다." });
        res.status(200).send({ product });
    } catch (error) {
        return res.status(401).send({ message: "잘못된 접근입니다." });
    }
});

// 상품 수정
router.patch("/:productId", async (req, res) => {
    const { productId } = req.params;
    const { productName, price, quantity } = req.body;
    const product = await Product.findOne({ _id: productId });

    try {
        if (!product) return res.status(404).send({ message: "존재하지 않는 상품입니다." });
        await Product.updateOne({ _id: productId }, { $set: { productName, price, quantity } });
        res.status(200).send({ message: "상품 수정이 완료되었습니다." });
    } catch (error) {
        return res.status(401).send({ message: "잘못된 접근입니다." });
    }
});

// 상품 삭제
router.delete("/:productId", async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findOne({ _id: productId });

    try {
        if (!product) return res.status(404).send({ message: "존재하지 않는 상품입니다." });
        await Product.deleteOne({ _id: productId });
        res.status(200).send({ message: "상품이 삭제되었습니다." });
    } catch (error) {
        return res.status(401).send({ message: "잘못된 접근입니다." });
    }
});

module.exports = router;
