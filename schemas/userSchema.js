const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
        },
        userId: {
            type: String,
        },
        password: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
