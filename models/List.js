const mongoose = require("mongoose");
const {itemsSchema} = require("./Item");

const listSchema = {
    name: String,
    items: [itemsSchema],
    id: String
};

const List = mongoose.model("List",listSchema);

module.exports = List;