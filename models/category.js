const mongoose = require('mongoose');


// Category Schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 32
    },


}, {timestamps: true});


module.exports = mongoose.model("Category", categorySchema);