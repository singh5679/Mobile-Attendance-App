const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { default: mongoose } = require("mongoose");
const Attendance = require("../models/Attendance");
const GeoFence = require("../models/GeoFence");


// Haversine Formula to calculate distance between two lat-long points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Mark Attendance 
router.post("/mark",authMiddleware, async (req, res) => {
  const {latitude, longitude } = req.body;
  const userId = req.userId; // From authMiddleware
  const fence = await GeoFence.findOne();
  if (!fence) return res.status(404).json({ message: "GeoFence not set" });

  const distance = calculateDistance(
    latitude,
    longitude,
    fence.latitude,
    fence.longitude
  );
  console.log("Distance :",distance);//
  if (distance > fence.radius) {
    return res.status(403).json({ 
      message: "Outside Geo-Fence",
      status: "OUTSIDE_GEOFENCE",
      distance: Math.round(distance)
     });
  }

  await Attendance.create({
    userId,
    latitude,
    longitude,
    status: "present"
  });

  res.json({ 
    message: "Attendance Marked Successfully" ,
    status: "present",
    distance: Math.round(distance)
  });

});

//histroy 
router.get("/history/:userId", async (req, res) => {
  const{ userId } = req.params;
  if(!mongoose.Types.ObjectId.isValid(userId)){
    return res.status(400).json({ message: "Invalid User ID" });
  }
  const records = await Attendance.find({ userId });
  res.json(records);
});

module.exports = router; 