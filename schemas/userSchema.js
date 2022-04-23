const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
    {
        seller: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
