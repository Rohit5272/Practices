const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  packSize: { type: String, required: true },
  MRP: { type: Number, required: true },
  status: { type: Boolean, required: true },
  category: {type: String },
  file: {
    data: Buffer, // Store file data as binary data
    contentType: String, // Store file content type
  },
});

module.exports = mongoose.model("Upload", uploadSchema);
