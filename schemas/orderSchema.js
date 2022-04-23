const mongoose = require("mongoose");
const orderSchema = mongoose.Schema(
    {
        orderer: {
            type: String,
            required: true,
        },
        orderHistory: {
            type: Array,
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
