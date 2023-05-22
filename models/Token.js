// models/token.model.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenExpiration = process.env.TOKEN_EXPIRATION

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: tokenExpiration*1,// this is the expiry time in seconds
    },
});
module.exports = mongoose.model("Token", tokenSchema);