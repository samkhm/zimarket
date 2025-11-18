const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name : { type : String, required : true},
    image : String,
    price : { type: String, required : true},
    size : { type: String, required : true},
    available : { type  : Boolean, default : "true"}
});

module.exports = mongoose.model("Store", itemSchema);