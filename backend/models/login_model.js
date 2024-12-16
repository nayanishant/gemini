var mongoose = require("mongoose")

const user = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model("userModel", user)

module.exports = userModel