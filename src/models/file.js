const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/CloudFile", { useNewUrlParser: true });
const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    size: Number,
    type: String,
    date: Date,
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CloudUser"
        },
    }
});

const File = mongoose.model("CloudFile", fileSchema);
module.exports = { File };