const mongoose = require("mongoose");
const orderSchema = mongoose.Schema(
    {
        orderer: {
            type: String,
            required: true,
        },
        productId: {
            type: String,
            required: true,
        },
        productName: {
            type: String,
            required: true,
        },
        orderQuantity: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
