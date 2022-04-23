const mongoose = require("mongoose");
const orderSchema = mongoose.Schema(
    {
        productId: {
            type: String,
        },
        orderQuantity: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
