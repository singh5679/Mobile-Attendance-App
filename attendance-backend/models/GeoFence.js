const mongoose = require("mongoose");

const GeoFenceSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  radius: Number // meters
});

module.exports = mongoose.model("GeoFence", GeoFenceSchema);